// src/components/TrainingSessionTabs.tsx

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Text,
  Spinner,
  Heading,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';

interface Props {
  trainingId: string;
}

interface Session {
  id: number;
  startDate: string;
  endDate: string;
  status?: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;      // current page index (0‐based)
  size: number;        // page size
  // any other pagination fields your backend returns…
}

const TrainingSessionTabs: React.FC<Props> = ({ trainingId }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [notStartedSessions, setNotStartedSessions] = useState<Session[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    setLoading(true);

    try {
      const [activeRes, completedRes, notStartedRes] = await Promise.all([
        api.get<PageResponse<Session>>(
          `/v1/sessions`,
          { params: { trainingId, sessionStatus: 'ACTIVE', page: 0, size: 100 } }
        ),
        api.get<PageResponse<Session>>(
          `/v1/sessions`,
          { params: { trainingId, sessionStatus: 'COMPLETED', page: 0, size: 100 } }
        ),
        api.get<PageResponse<Session>>(
          `/v1/sessions`,
          { params: { trainingId, sessionStatus: 'NOT_STARTED', page: 0, size: 100 } }
        ),
      ]);

      setActiveSessions(activeRes.data.content);
      setCompletedSessions(completedRes.data.content);
      setNotStartedSessions(notStartedRes.data.content);
    } catch (err) {
      toast({
        title: 'Failed to load sessions',
        description: 'Using fallback mock data.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });

      // Fallback mock
      const mock: Session[] = [
        { id: 1, startDate: '2024-05-01', endDate: '2024-05-05' },
        { id: 2, startDate: '2024-06-01', endDate: '2024-06-10' },
      ];
      setActiveSessions(mock);
      setCompletedSessions(mock);
      setNotStartedSessions(mock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingId]);

  const renderSessionTable = (sessions: Session[]) => {
    if (loading) {
      return <Spinner size="md" />;
    }

    if (!sessions.length) {
      return <Text>No sessions found.</Text>;
    }

    return (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Start Date</Th>
            <Th>End Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sessions.map((s) => (
            <Tr
              key={s.id}
              onClick={() => navigate(`/sessions/${s.id}`)}
              _hover={{ bg: 'teal.100', cursor: 'pointer' }}
            >
              <Td>{s.id}</Td>
              <Td>{s.startDate}</Td>
              <Td>{s.endDate}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md" mt={10}>
        Sessions
      </Heading>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <Tabs variant="enclosed" mt={2} width="100%">
          <TabList>
            <Tab>Active</Tab>
            <Tab>Completed</Tab>
            <Tab>Not Started</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={4}>
              {renderSessionTable(activeSessions)}
            </TabPanel>
            <TabPanel p={0} pt={4}>
              {renderSessionTable(completedSessions)}
            </TabPanel>
            <TabPanel p={0} pt={4}>
              {renderSessionTable(notStartedSessions)}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </VStack>
  );
};

export default TrainingSessionTabs;
