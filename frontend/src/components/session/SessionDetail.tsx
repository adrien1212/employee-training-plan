// src/components/SessionDetail.tsx

import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Container,
  VStack,
  HStack,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../service/api';
import SessionEnrollments from './SessionEnrollments';
import SessionFeedback from './SessionFeedback';

interface SessionDetailData {
  id: number;
  title: string;
  date: string;      // ISO 8601, e.g. "2025-06-01T14:00:00Z"
  speaker: string;
  status: 'DRAFT' | 'NOT_STARTED' | 'ACTIVE' | 'COMPLETED';
  accessToken: string;
  description?: string;
  location?: string;
}

const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [session, setSession] = useState<SessionDetailData | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [closing, setClosing] = useState(false);

  // Fetch session details
  const fetchSession = useCallback(async () => {
    setLoadingSession(true);
    try {
      const res = await api.get<SessionDetailData>(`v1/sessions/${id}`);
      setSession(res.data);
    } catch (err) {
      toast({
        title: 'Failed to load session details',
        description: `Could not fetch session with ID ${id}.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingSession(false);
    }
  }, [id, toast]);

  useEffect(() => {
    if (id) fetchSession();
  }, [id, fetchSession]);

  // Handler to update status whenever StatusScroller changes it
  const handleStatusChange = async (newStatus: 'DRAFT' | 'NOT_STARTED' | 'ACTIVE') => {
    if (!session) return;
    // If they pick the same status, do nothing
    if (session.status === newStatus) return;

    setUpdatingStatus(true);
    try {
      // Send PATCH /v1/sessions/{id} { "status": newStatus }
      await api.patch(`v1/sessions/${session.id}`, { status: newStatus });
      // Optimistically update local state—alternatively, you can re-fetch
      setSession({
        ...session,
        status: newStatus,
      });
      toast({
        title: 'Status updated',
        description: `Session is now ${newStatus.replace('_', ' ').toLowerCase()}.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to update status',
        description: 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Mark session as complete (your existing function)
  const completeSession = async () => {
    if (!session) return;
    setCompleting(true);
    try {
      await api.post(`v1/sessions/${session.id}/complete/${session.accessToken}`);
      toast({
        title: 'Session completed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchSession();
    } catch (err) {
      toast({
        title: 'Failed to complete session',
        description: 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCompleting(false);
    }
  };

  // Close session (your existing function)
  const closeSession = async () => {
    if (!session) return;
    setClosing(true);
    try {
      await api.post(`v1/sessions/complete/${session.accessToken}`);
      toast({
        title: 'Session closed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchSession();
    } catch (err) {
      toast({
        title: 'Failed to close session',
        description: 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setClosing(false);
    }
  };

  if (loadingSession) {
    return (
      <Container maxW="4xl" py={10} textAlign="center">
        <Spinner size="xl" />
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxW="4xl" py={10} textAlign="center">
        <Text>No session data available.</Text>
        <Button mt={4} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={10}>
      <VStack align="start" spacing={6}>
        <HStack justify="space-between" width="100%">
          <Heading>{session.title}</Heading>
          <Button size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </HStack>

        <Box>
          <Text fontWeight="bold">Session ID:</Text>
          <Text>{session.id}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold">Date:</Text>
          <Text>
            {new Date(session.date).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </Box>

        <Box>
          <Text fontWeight="bold">Speaker:</Text>
          <Text>{session.speaker}</Text>
        </Box>

        {/* ↓↓↓ REPLACE the static Status display with your StatusScroller ↓↓↓ */}
        <Box w="100%">
          <Text fontWeight="bold" mb={2}>
            Status:
          </Text>
          
          {updatingStatus && (
            <Text fontSize="sm" color="gray.500" mt={1}>
              Updating status…
            </Text>
          )}
        </Box>
        {/* ↑↑↑ end StatusScroller ↑↑↑ */}

        {session.status === 'ACTIVE' && (
          <HStack spacing={4}>
            <Button
              colorScheme="teal"
              isLoading={completing}
              onClick={completeSession}
            >
              Complete Session
            </Button>
            <Button
              colorScheme="red"
              isLoading={closing}
              onClick={closeSession}
            >
              Close Session
            </Button>
          </HStack>
        )}

        {session.location && (
          <Box>
            <Text fontWeight="bold">Location:</Text>
            <Text>{session.location}</Text>
          </Box>
        )}

        {session.description && (
          <Box>
            <Text fontWeight="bold">Description:</Text>
            <Text whiteSpace="pre-wrap">{session.description}</Text>
          </Box>
        )}

        {/* Enrollment Section */}
        <SessionEnrollments sessionId={String(session.id)} />

        {/* Feedback Section */}
        {session.status === 'COMPLETED' && (
          <SessionFeedback sessionId={String(session.id)} />
        )}
      </VStack>
    </Container>
  );
};

export default SessionDetail;
