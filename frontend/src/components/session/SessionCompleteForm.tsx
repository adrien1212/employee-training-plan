// src/components/SessionCompleteForm.tsx

import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  useToast,
  HStack,
  Spinner,
} from '@chakra-ui/react';
import api from '../../service/api';

interface SessionCompleteFormProps {
  onSuccess?: (session: { id: number; title?: string }) => void;
}

const SessionCompleteForm: React.FC<SessionCompleteFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const [accessToken, setAccessToken] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitComplete = async () => {
    if (!accessToken.trim()) {
      toast({
        title: 'Please provide access token.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<{ id: number; title?: string }>(
        `v1/sessions/complete/${accessToken.trim()}`
      );
      toast({
        title: 'Session completed',
        description: `Session ${res.data.id} has been marked complete.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setSessionId('');
      setAccessToken('');
      onSuccess?.(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to complete session.';
      toast({
        title: 'Error',
        description: msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="white">
      <VStack align="start" spacing={4}>
        <Box width="100%">
          <Text mb={1}>Access Token:</Text>
          <Input
            placeholder="Enter access token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            isDisabled={submitting}
          />
        </Box>
        <Button
          colorScheme="teal"
          onClick={submitComplete}
          isLoading={submitting}
        >
          Complete Session
        </Button>
      </VStack>
    </Box>
  );
};

export default SessionCompleteForm;
