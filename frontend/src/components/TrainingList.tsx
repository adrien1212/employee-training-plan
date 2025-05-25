import { useEffect, useState } from 'react';
import {
  Box, Heading, Button, Text, VStack, Collapse, Divider,
  Container, Spinner, useDisclosure, IconButton,
  Link
} from '@chakra-ui/react';
import axios from 'axios';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import api from '../service/api';

interface Training {
  id: number;
  title: string;
  description: string;
  provider: string;
}

interface Session {
  id: number;
  startDate: string;
  endDate: string;
}

const TrainingList = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [sessionsMap, setSessionsMap] = useState<Record<number, Session[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});


  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await api.get('v1/trainings');
        setTrainings(res.data);
      } catch {
        // mock fallback
        setTrainings([
          { id: 1, title: 'React', description: 'Frontend', provider: 'John' },
          { id: 2, title: 'Spring Boot', description: 'Backend', provider: 'Jane' },
        ]);
      }
    };

    fetchTrainings();
  }, []);

  const toggleSessions = async (trainingId: number) => {
    const isOpen = openMap[trainingId];
    setOpenMap((prev) => ({ ...prev, [trainingId]: !isOpen }));

    // Only fetch sessions if not already fetched
    if (!isOpen && !sessionsMap[trainingId]) {
      setLoadingMap((prev) => ({ ...prev, [trainingId]: true }));
      try {
        const res = await api.get(`v1/sessions?trainingId=${trainingId}`);
        setSessionsMap((prev) => ({ ...prev, [trainingId]: res.data }));
      } catch {
        
      } finally {
        setLoadingMap((prev) => ({ ...prev, [trainingId]: false }));
      }
    }
  };

  return (
    <Container maxW="4xl" py={10}>
      <Heading mb={6}>Training Programs</Heading>
      <VStack spacing={6} align="stretch">
        {trainings.map((training) => {
          const isOpen = openMap[training.id];
          const sessions = sessionsMap[training.id];
          const isLoading = loadingMap[training.id];

          return (
            <Box key={training.id} p={4} borderWidth={1} borderRadius="lg" boxShadow="sm">
              <Heading size="md">{training.title}</Heading>
              <Text mt={1}><strong>Provider:</strong> {training.provider}</Text>
              <Text><strong>Description:</strong> {training.description}</Text>
              <Heading size="md">
                <Link as={RouterLink} to={`/trainings/${training.id}`} color="teal.500">
                    {training.title}
                </Link>
              </Heading>
              <Box mt={4}>
                <Button
                  onClick={() => toggleSessions(training.id)}
                  leftIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  size="sm"
                  variant="outline"
                >
                  {isOpen ? 'Hide Sessions' : 'View Sessions'}
                </Button>

                <Button
                  as={RouterLink}
                  to={`/trainings/${training.id}/sessions/new`}
                  size="sm"
                  colorScheme="teal"
                  ml={2}
                >
                  + New Session
                </Button>
              </Box>

              <Collapse in={isOpen} animateOpacity>
                <Box mt={4} pl={2}>
                  {isLoading ? (
                    <Spinner size="sm" />
                  ) : sessions?.length ? (
                    <VStack align="start" spacing={2}>
                      {sessions.map((s) => (
                        <Box key={s.id}>
                          <Text>📅 {s.startDate} → {s.endDate}</Text>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text>No sessions found.</Text>
                  )}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </VStack>
    </Container>
  );
};

export default TrainingList;
