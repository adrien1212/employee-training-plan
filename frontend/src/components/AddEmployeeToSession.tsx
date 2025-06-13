import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  List,
  ListItem,
  Spinner,
  Stack,
  useToast,
  Text,
  Checkbox,
  Flex,
} from '@chakra-ui/react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../service/api';

interface Session {
  id: number;
  startDate: string;
  endDate: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
}

interface Department {
  id: number;
  name: string;
}

// Define a generic Page interface matching Spring’s Page<T> shape
interface Page<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

const AddEmployeeToSession: React.FC = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const location = useLocation();
  const toast = useToast();

  // Get the auto-selected employeeId from navigation state (if present)
  const autoSelectEmployeeId: number | null =
    (location.state as any)?.autoSelectEmployeeId ?? null;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  // Employees not subscribed to the selected session (for adding)
  const [employees, setEmployees] = useState<Employee[]>([]);
  // Employees already subscribed to the selected session
  const [subscribedEmployees, setSubscribedEmployees] = useState<Employee[]>([]);

  // Selected employees (for adding)
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  // Selected employees (for removing)
  const [selectedSubscribedEmployees, setSelectedSubscribedEmployees] = useState<number[]>([]);

  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSubscribed, setLoadingSubscribed] = useState<boolean>(false);

  // Fetch all sessions when component mounts
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const sesRes = await api.get<Page<Session>>(
          `/v1/sessions?trainingId=${trainingId}&sessionStatus=NOT_STARTED`
        );
        setSessions(sesRes.data.content);

        // Auto-select the first session only if none is selected
        if (sesRes.data.content.length > 0 && !selectedSession) {
          setSelectedSession(sesRes.data.content[0].id);
        }
      } catch (err) {
        toast({
          title: 'Error loading sessions',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
    // eslint-disable-next-line
  }, [toast, trainingId]);

  // Extracted fetch functions for reusability
  const fetchUnsubscribedEmployees = async (sessionId: number | null) => {
    if (!sessionId) {
      setEmployees([]);
      return;
    }
    setLoading(true);
    try {
      // Expecting a Page<Employee> instead of Employee[]
      const empRes = await api.get<Page<Employee>>(
        `/v1/employees?sessionId=${sessionId}&isSubscribeToSession=false`
      );
      setEmployees(empRes.data.content);

      // Auto-select employee if provided and present in the list
      if (autoSelectEmployeeId) {
        const found = empRes.data.content.some(
          (emp) => emp.id === autoSelectEmployeeId
        );
        if (found) {
          setSelectedEmployees([autoSelectEmployeeId]);
        } else {
          setSelectedEmployees([]);
        }
      }
    } catch (err) {
      toast({
        title: 'Error loading employees',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribedEmployees = async (sessionId: number | null) => {
    if (!sessionId) {
      setSubscribedEmployees([]);
      return;
    }
    setLoadingSubscribed(true);
    try {
      // Expecting a Page<Employee> instead of Employee[]
      const res = await api.get<Page<Employee>>(
        `/v1/employees?sessionId=${sessionId}&isSubscribeToSession=true`
      );
      setSubscribedEmployees(res.data.content);
    } catch (err) {
      toast({
        title: 'Error loading subscribed employees',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setSubscribedEmployees([]);
    } finally {
      setLoadingSubscribed(false);
    }
  };

  // Call this after add/remove to reload both employee panels!
  const refreshEmployees = async (sessionId: number | null) => {
    await Promise.all([
      fetchUnsubscribedEmployees(sessionId),
      fetchSubscribedEmployees(sessionId),
    ]);
  };

  // When selected session changes, reload employees for both panels
  useEffect(() => {
    if (selectedSession) {
      refreshEmployees(selectedSession);
    } else {
      setEmployees([]);
      setSubscribedEmployees([]);
    }
    setSelectedEmployees([]);
    setSelectedSubscribedEmployees([]);
    // eslint-disable-next-line
  }, [selectedSession, toast]);

  // If sessions update (e.g. loaded after mount), auto-select first if not already
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0].id);
    }
    // eslint-disable-next-line
  }, [sessions]);

  const handleSessionSelect = (id: number) => {
    setSelectedSession(id);
    setSelectedEmployees([]);
    setSelectedSubscribedEmployees([]);
  };

  const handleEmployeeToggle = (id: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleSubscribedEmployeeToggle = (id: number) => {
    setSelectedSubscribedEmployees((prev) =>
      prev.includes(id)
        ? prev.filter((empId) => empId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || selectedEmployees.length === 0) return;

    try {
      await Promise.all(
        selectedEmployees.map((empId) =>
          api.post(`/v1/sessions/${selectedSession}/subscribe/${empId}`, {
            employeeId: empId,
          })
        )
      );
      toast({
        title: 'Employees added to session!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setSelectedEmployees([]);
      refreshEmployees(selectedSession);
    } catch (err) {
      toast({
        title: 'Error adding employees',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  // REMOVE EMPLOYEES FROM SESSION
  const handleRemove = async () => {
    if (!selectedSession || selectedSubscribedEmployees.length === 0) return;

    try {
      await Promise.all(
        selectedSubscribedEmployees.map((empId) =>
          api.delete(`/v1/sessions/${selectedSession}/subscribe/${empId}`)
        )
      );
      toast({
        title: 'Employees removed from session!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setSelectedSubscribedEmployees([]);
      refreshEmployees(selectedSession);
    } catch (err) {
      toast({
        title: 'Error removing employees',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  return (
    <Container maxW="7xl" py={10}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={6}>
          Add Employees to a Session for Training #{trainingId}
        </Heading>
        {loading && !selectedSession ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit}>
            <Flex gap={6}>
              {/* Left Panel: Sessions */}
              <Box
                flex={1}
                borderWidth={1}
                borderRadius="lg"
                p={4}
                bg="gray.50"
                minW="230px"
              >
                <Heading size="sm" mb={2}>
                  Sessions
                </Heading>
                <List spacing={2}>
                  {sessions.map((session) => (
                    <ListItem
                      key={session.id}
                      onClick={() => handleSessionSelect(session.id)}
                      cursor="pointer"
                      bg={
                        selectedSession === session.id
                          ? 'teal.100'
                          : 'transparent'
                      }
                      borderRadius="md"
                      px={2}
                      py={1}
                      _hover={{ bg: 'teal.50' }}
                    >
                      <Text
                        fontWeight={
                          selectedSession === session.id ? 'bold' : 'normal'
                        }
                      >
                        {session.startDate} - {session.endDate}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Middle Panel: Employees to Add */}
              <Box
                flex={2}
                borderWidth={1}
                borderRadius="lg"
                p={4}
                bg="gray.50"
                minW="300px"
              >
                <Heading size="sm" mb={2}>
                  Select Employees
                </Heading>
                <FormControl>
                  {loading && selectedSession ? (
                    <Spinner />
                  ) : (
                    <Stack spacing={2} maxH="350px" overflowY="auto">
                      {employees.length === 0 ? (
                        <Text fontStyle="italic" color="gray.500">
                          {selectedSession
                            ? 'No employees available to add to this session.'
                            : 'Select a session to see available employees.'}
                        </Text>
                      ) : (
                        employees.map((emp) => (
                          <Checkbox
                            key={emp.id}
                            isChecked={selectedEmployees.includes(emp.id)}
                            onChange={() => handleEmployeeToggle(emp.id)}
                          >
                            {emp.firstName} {emp.lastName} - {emp.email} [{emp.department.name}]
                          </Checkbox>
                        ))
                      )}
                    </Stack>
                  )}
                </FormControl>
              </Box>

              {/* Right Panel: Already Subscribed Employees */}
              <Box
                flex={2}
                borderWidth={1}
                borderRadius="lg"
                p={4}
                bg="gray.50"
                minW="300px"
              >
                <Heading size="sm" mb={2}>
                  Subscribed Employees
                </Heading>
                {loadingSubscribed ? (
                  <Spinner />
                ) : (
                  <FormControl>
                    <Stack spacing={2} maxH="350px" overflowY="auto">
                      {subscribedEmployees.length === 0 ? (
                        <Text fontStyle="italic" color="gray.500">
                          {selectedSession
                            ? 'No employees are currently subscribed to this session.'
                            : 'Select a session to see subscribed employees.'}
                        </Text>
                      ) : (
                        subscribedEmployees.map((emp) => (
                          <Checkbox
                            key={emp.id}
                            isChecked={selectedSubscribedEmployees.includes(emp.id)}
                            onChange={() =>
                              handleSubscribedEmployeeToggle(emp.id)
                            }
                          >
                            {emp.firstName} {emp.lastName} - {emp.email} [{emp.department.name}]
                          </Checkbox>
                        ))
                      )}
                    </Stack>
                  </FormControl>
                )}
                {/* Remove Button */}
                <Button
                  mt={4}
                  colorScheme="red"
                  width="full"
                  isDisabled={!selectedSession || selectedSubscribedEmployees.length === 0}
                  onClick={handleRemove}
                  type="button"
                >
                  Remove Employee{selectedSubscribedEmployees.length > 1 ? 's' : ''} from Session
                </Button>
              </Box>
            </Flex>
            <Button
              mt={6}
              type="submit"
              colorScheme="teal"
              width="full"
              isDisabled={!selectedSession || selectedEmployees.length === 0}
            >
              Add Employee{selectedEmployees.length > 1 ? 's' : ''} to Session
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
};

export default AddEmployeeToSession;
