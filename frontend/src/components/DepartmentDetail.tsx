// src/pages/DepartmentDetail.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Heading, Text, Spinner, VStack, Container, useToast, Divider, List, ListItem, Button
} from '@chakra-ui/react';
import api from '../service/api';

// --- Interfaces ---
interface Department {
  id: number;
  name: string;
  location: string;
  // Add more fields as available
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Training {
  id: number;
  title: string;
  description?: string;
  departmentId: number;
}

// --- DepartmentDetail Component ---
const DepartmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  // Employees and trainings (optional, fetch if relevant)
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loadingTrainings, setLoadingTrainings] = useState(false);

  // Fetch department details
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await api.get<Department>(`/v1/departments/${id}`);
        setDepartment(res.data);
      } catch (err) {
        toast({
          title: 'Failed to load department details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id, toast]);

  // Optionally: fetch employees of this department
  useEffect(() => {
    if (!department) return;
    setLoadingEmployees(true);
    api.get<Employee[]>(`/v1/employees?departmentId/${department.id}`)
      .then(res => setEmployees(res.data))
      .catch(() => {
        toast({
          title: 'Failed to load employees',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
      })
      .finally(() => setLoadingEmployees(false));
  }, [department, toast]);

  // Optionally: fetch trainings of this department
  useEffect(() => {
    if (!department) return;
    setLoadingTrainings(true);
    api.get<Training[]>(`/v1/trainings?departmentId=${department.id}`)
      .then(res => setTrainings(res.data))
      .catch(() => {
        toast({
          title: 'Failed to load trainings',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
      })
      .finally(() => setLoadingTrainings(false));
  }, [department, toast]);

  return (
    <Container maxW="4xl" py={10}>
      <Button mb={6} onClick={() => navigate(-1)}>Back</Button>

      {loading ? (
        <Spinner size="xl" />
      ) : department ? (
        <VStack align="start" spacing={6}>
          {/* Department Info */}
          <Box>
            <Heading size="lg">Department Details</Heading>
            <Text><b>ID:</b> {department.id}</Text>
            <Text><b>Name:</b> {department.name}</Text>
            <Text><b>Location:</b> {department.location || '—'}</Text>
          </Box>

          <Divider />

          {/* Employees List */}
          <Box>
            <Heading size="md" mb={2}>Employees</Heading>
            {loadingEmployees ? (
              <Spinner size="md" />
            ) : employees.length === 0 ? (
              <Text>No employees found for this department.</Text>
            ) : (
              <List spacing={2}>
                {employees.map(emp => (
                  <ListItem key={emp.id} borderWidth="1px" borderRadius="lg" p={3}>
                    <Text><b>Name:</b> {emp.firstName} {emp.lastName}</Text>
                    <Text><b>Email:</b> {emp.email}</Text>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Divider />

          {/* Trainings List */}
          <Box>
            <Heading size="md" mb={2}>Trainings</Heading>
            {loadingTrainings ? (
              <Spinner size="md" />
            ) : trainings.length === 0 ? (
              <Text>No trainings found for this department.</Text>
            ) : (
              <List spacing={2}>
                {trainings.map(training => (
                  <ListItem key={training.id} borderWidth="1px" borderRadius="lg" p={3}>
                    <Text><b>Title:</b> {training.title}</Text>
                    {training.description && (
                      <Text><b>Description:</b> {training.description}</Text>
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </VStack>
      ) : (
        <Text>Department not found.</Text>
      )}
    </Container>
  );
};

export default DepartmentDetail;
