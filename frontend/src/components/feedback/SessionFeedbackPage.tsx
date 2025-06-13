// src/components/SessionFeedbackPage.tsx

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import api from '../../service/api';
import SessionFeedbackForm from './SessionFeedbackForm';

interface ValidateResponse {
  valid: boolean;
  sessionId: number;
  employeeId: number;
}

interface SessionInfo {
  id: number;
  title: string;
}

interface EmployeeInfo {
  id: number;
  firstName: string;
  lastName: string;
}

const SessionFeedbackPage: React.FC = () => {
  const toast = useToast();

  const [tokenInput, setTokenInput] = useState('');
  const [validatedData, setValidatedData] = useState<ValidateResponse | null>(
    null
  );
  const [loadingValidate, setLoadingValidate] = useState(false);

  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleLoadForm = async () => {
    const token = tokenInput.trim();
    if (!token) {
      toast({
        title: 'Please enter your feedback token.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoadingValidate(true);

    try {
      const res = await api.get<ValidateResponse>(`v1/feedbacks/validate`, {
        params: { token },
      });

      if (res.data.valid) {
        setValidatedData(res.data);
      } else {
        toast({
          title: 'Invalid token',
          description: 'Please check your feedback token and try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err: any) {
      const status = err.response?.status;
      const msgFromServer = err.response?.data?.message;
      let errorMsg = 'Failed to validate token.';
      if (status === 404) {
        errorMsg = 'Token not found.';
      } else if (status === 400 && msgFromServer) {
        errorMsg = msgFromServer;
      }
      toast({
        title: 'Validation Error',
        description: errorMsg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingValidate(false);
    }
  };

  useEffect(() => {
    if (!validatedData) return;

    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const [sessionRes, employeeRes] = await Promise.all([
          api.get<SessionInfo>(`v1/sessions/${validatedData.sessionId}`),
          api.get<EmployeeInfo>(`v1/employees/${validatedData.employeeId}`),
        ]);
        setSessionInfo(sessionRes.data);
        setEmployeeInfo(employeeRes.data);
      } catch {
        toast({
          title: 'Failed to load details',
          description: 'Could not fetch session or employee info.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setValidatedData(null);
        setSessionInfo(null);
        setEmployeeInfo(null);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [validatedData, toast]);

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
      bg="white"
    >
      <VStack spacing={6} align="stretch">
        <Heading size="md">Submit Your Feedback</Heading>

        {!validatedData ? (
          <>
            <Text>Please enter the feedback token you received by email:</Text>
            <Input
              placeholder="Feedback Token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              isDisabled={loadingValidate}
            />
            <Button
              colorScheme="teal"
              onClick={handleLoadForm}
              isLoading={loadingValidate}
            >
              Load Feedback Form
            </Button>
          </>
        ) : loadingDetails || !sessionInfo || !employeeInfo ? (
          <HStack justify="center">
            <Spinner size="lg" />
            <Text>Loading details...</Text>
          </HStack>
        ) : (
          <>
            <Text fontSize="lg" fontWeight="medium">
              Hello {employeeInfo.firstName}, please provide feedback for session{" "}
              &quot;{sessionInfo.title}&quot;.
            </Text>

            <SessionFeedbackForm
              feedbackToken={tokenInput.trim()}
              onSuccess={() => {
                toast({
                  title: 'Thank you!',
                  description: 'Your feedback has been submitted.',
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                });
                setValidatedData(null);
                setTokenInput('');
                setSessionInfo(null);
                setEmployeeInfo(null);
              }}
            />
          </>
        )}
      </VStack>
    </Box>
  );
};

export default SessionFeedbackPage;
