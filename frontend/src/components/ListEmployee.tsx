import { useEffect, useState } from 'react';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Spinner,
  Heading, useToast, Container, Text, Input, VStack,
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure,
  HStack
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';
import CreateEmployee from './CreateEmployee'; // Adjust the import if the path is different

interface Department {
  id: number,
  name: string
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('v1/employees');
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      toast({
        title: 'Error loading data',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = employees.filter((emp) =>
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  // Handler after successful employee creation (modal close and refresh)
  // const handleEmployeeCreated = () => {
  //   onClose();
  //   fetchEmployees(); // Refresh list
  // };

  return (
    <Container maxW="6xl" py={10}>
      <VStack align="start" spacing={4} mb={6} width="100%">
        <HStack justify="space-between" width="100%">
          <Heading>Employee List</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>
            Add Employee
          </Button>
        </HStack>
        <Input
          placeholder="Search by last name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
      </VStack>

      {loading ? (
        <Spinner size="xl" />
      ) : filteredEmployees.length === 0 ? (
        <Text>No employees found.</Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Email</Th>
                <Th>Department</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredEmployees.map((emp) => (
                <Tr
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  _hover={{ bg: 'teal.100', cursor: 'pointer' }}
                >
                  <Td>{emp.id}</Td>
                  <Td>{emp.firstName}</Td>
                  <Td>{emp.lastName}</Td>
                  <Td>{emp.email}</Td>
                  <Td>{emp.department.name || '—'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Modal for CreateEmployee */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <CreateEmployee onCreated={handleEmployeeCreated} /> */}
            <CreateEmployee/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default EmployeeList;
