import { useEffect, useState } from 'react';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td,
  Input, Button, Heading, useToast, Container, Spinner,
  VStack, Text
} from '@chakra-ui/react';
import axios from 'axios';

interface Session {
  id: number;
  startDate: string;
  endDate: string;
  trainingTitle?: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const ListSession = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchInputs, setSearchInputs] = useState<Record<number, string>>({});
  const [searchResults, setSearchResults] = useState<Record<number, Employee[]>>({});
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/sessions');
        setSessions(res.data);
      } catch {
        // Fallback mock
        setSessions([
          { id: 1, startDate: '2024-05-01', endDate: '2024-05-10', trainingTitle: 'React' },
          { id: 2, startDate: '2024-06-01', endDate: '2024-06-05', trainingTitle: 'Spring Boot' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSearchChange = (sessionId: number, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [sessionId]: value }));
  };

  const handleSearch = async (sessionId: number) => {
    const query = searchInputs[sessionId];
    if (!query) return;

    try {
      const res = await axios.get(`http://localhost:8080/api/employees/search?query=${query}`);
      setSearchResults((prev) => ({ ...prev, [sessionId]: res.data }));
    } catch {
      // mock fallback
      setSearchResults((prev) => ({
        ...prev,
        [sessionId]: [
          { id: 101, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          { id: 102, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
        ],
      }));
    }
  };

  const handleSubscribe = async (sessionId: number, employeeId: number) => {
    try {
      await axios.post(`http://localhost:8080/api/sessions/${sessionId}/subscribe/${employeeId}`);
      toast({
        title: `Employee ${employeeId} subscribed to session ${sessionId}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Clear search result after subscribing
      setSearchInputs((prev) => ({ ...prev, [sessionId]: '' }));
      setSearchResults((prev) => ({ ...prev, [sessionId]: [] }));
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not subscribe employee',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="6xl" py={10}>
      <Heading mb={6}>Subscribe Employees to Sessions</Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Session ID</Th>
              <Th>Training</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Search Employee</Th>
              <Th>Results</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sessions.map((session) => (
              <Tr key={session.id}>
                <Td>{session.id}</Td>
                <Td>{session.trainingTitle}</Td>
                <Td>{session.startDate}</Td>
                <Td>{session.endDate}</Td>
                <Td>
                  <VStack spacing={2} align="start">
                    <Input
                      size="sm"
                      placeholder="Search by email or last name"
                      value={searchInputs[session.id] || ''}
                      onChange={(e) => handleSearchChange(session.id, e.target.value)}
                    />
                    <Button size="xs" onClick={() => handleSearch(session.id)}>
                      Search
                    </Button>
                  </VStack>
                </Td>
                <Td>
                  <VStack spacing={2} align="start">
                    {(searchResults[session.id] || []).map((emp) => (
                      <Box key={emp.id} display="flex" alignItems="center" gap={2}>
                        <Text fontSize="sm">
                          {emp.firstName} {emp.lastName} ({emp.email})
                        </Text>
                        <Button
                          size="xs"
                          colorScheme="blue"
                          onClick={() => handleSubscribe(session.id, emp.id)}
                        >
                          Subscribe
                        </Button>
                      </Box>
                    ))}
                  </VStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Container>
  );
};

export default ListSession;
