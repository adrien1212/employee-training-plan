import {
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Table, Thead, Tr, Th, Td, Tbody, Text, Spinner, Heading
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
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
  
  const TrainingSessionTabs: React.FC<Props> = ({ trainingId }) => {
    const [activeSessions, setActiveSessions] = useState<Session[]>([]);
    const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
    const [notStartedSessions, setNotStartedSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
  
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const [active, completed, notStarted] = await Promise.all([
          api.get(`v1/sessions?trainingId=${trainingId}&sessionStatus=ACTIVE`),
          api.get(`v1/sessions?trainingId=${trainingId}&sessionStatus=COMPLETED`),
          api.get(`v1/sessions?trainingId=${trainingId}&sessionStatus=NOT_STARTED`),
        ]);
  
        setActiveSessions(active.data);
        setCompletedSessions(completed.data);
        setNotStartedSessions(notStarted.data);
      } catch {
        // fallback mock
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
    }, [trainingId]);
  
    const renderSessionTable = (sessions: Session[]) => {
      if (!sessions.length) return <Text>No sessions found.</Text>;
  
      return (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Start</Th>
              <Th>End</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sessions.map((s) => (
              <Tr key={s.id}>
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
      <>
        <Heading size="md" mt={10} mb={2}>Sessions</Heading>
        {loading ? (
          <Spinner size="md" />
        ) : (
          <Tabs variant="enclosed" mt={2} w="100%">
            <TabList>
              <Tab>Active</Tab>
              <Tab>Completed</Tab>
              <Tab>Not Started</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>{renderSessionTable(activeSessions)}</TabPanel>
              <TabPanel>{renderSessionTable(completedSessions)}</TabPanel>
              <TabPanel>{renderSessionTable(notStartedSessions)}</TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </>
    );
  };
  
  export default TrainingSessionTabs;
  