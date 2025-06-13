// src/components/SessionCompletePage.tsx

import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import SessionCompleteForm from '../components/session/SessionCompleteForm';

const SessionCompletePage: React.FC = () => {
  const toast = useToast();
  const [completedSession, setCompletedSession] = useState<{
    id: number;
    title?: string;
  } | null>(null);

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
        <Heading size="md">Complete a Session</Heading>

        {completedSession ? (
          <Text>
            Session {completedSession.id} has been completed successfully.
            {completedSession.title && (
              <> (Title: "{completedSession.title}")</>
            )}
          </Text>
        ) : (
          <>
            <Text>
              Enter the Session ID and its Access Token to mark it as complete:
            </Text>
            <SessionCompleteForm
              onSuccess={(session) => setCompletedSession(session)}
            />
          </>
        )}
      </VStack>
    </Box>
  );
};

export default SessionCompletePage;
