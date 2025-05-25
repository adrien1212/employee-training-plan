// src/components/DepartmentList.tsx

import { useEffect, useState } from 'react';
import {
  Box, Heading, Spinner, Text, Table, Thead, Tbody, Tr, Th, Td, Container
} from '@chakra-ui/react';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';

interface Department {
  id: number;
  name: string;
  location: string;
}

const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/v1/companies/departments');
        setDepartments(res.data);
      } catch {
        // fallback mock
        setDepartments([
          { id: 1, name: 'Engineering', location: 'Paris' },
          { id: 2, name: 'HR', location: 'Lyon' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <Container maxW="4xl" py={10}>
      <Heading mb={6}>Your Departments</Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : departments.length === 0 ? (
        <Text>No departments found for your company.</Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Location</Th>
              </Tr>
            </Thead>
            <Tbody>
              {departments.map((dept) => (
                <Tr
                  key={dept.id}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                  onClick={() =>
                    navigate(`/departments/${dept.id}`, {
                      state: { name: dept.name },
                    })
                  }
                >
                  <Td>{dept.id}</Td>
                  <Td>{dept.name}</Td>
                  <Td>{dept.location}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Container>
  );
};

export default DepartmentList;
