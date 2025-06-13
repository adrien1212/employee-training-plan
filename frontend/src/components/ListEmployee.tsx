import { useEffect, useState } from 'react';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Spinner,
  Heading, useToast, Container, Text, Input, VStack,
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  useDisclosure, HStack, Select
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';
import CreateEmployee from './CreateEmployee';

interface Department {
  id: number;
  name: string;
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
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [departmentOptions, setDepartmentOptions] = useState<{ id: number, name: string }[]>([]);

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        size: pageSize,
      };
      if (filters.firstName) params.firstName = filters.firstName;
      if (filters.lastName) params.lastName = filters.lastName;
      if (filters.email) params.email = filters.email;
      if (filters.departmentId) params.departmentId = filters.departmentId;

      const res = await api.get('v1/employees', { params });

      setEmployees(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast({
        title: 'Failed to load employees',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('v1/departments');
      setDepartmentOptions(res.data);
    } catch (err) {
      toast({
        title: 'Failed to load departments',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters, currentPage, pageSize]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(0); // reset to first page on filter
  };

  return (
    <Container maxW="6xl" py={10}>
      <VStack align="start" spacing={4} mb={6} width="100%">
        <HStack justify="space-between" width="100%">
          <Heading>Employee List</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>
            Add Employee
          </Button>
        </HStack>

        <HStack spacing={4} wrap="wrap" width="100%">
          <Input
            placeholder="Search by first name"
            value={filters.firstName}
            onChange={(e) => handleFilterChange('firstName', e.target.value)}
            width="200px"
          />
          <Input
            placeholder="Search by last name"
            value={filters.lastName}
            onChange={(e) => handleFilterChange('lastName', e.target.value)}
            width="200px"
          />
          <Input
            placeholder="Search by email"
            value={filters.email}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            width="200px"
          />
          <Select
            placeholder="Filter by department"
            value={filters.departmentId}
            onChange={(e) => handleFilterChange('departmentId', e.target.value)}
            width="200px"
          >
            {departmentOptions.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </Select>
        </HStack>
      </VStack>

      {loading ? (
        <Spinner size="xl" />
      ) : employees.length === 0 ? (
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
              {employees.map((emp) => (
                <Tr
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  _hover={{ bg: 'teal.100', cursor: 'pointer' }}
                >
                  <Td>{emp.id}</Td>
                  <Td>{emp.firstName}</Td>
                  <Td>{emp.lastName}</Td>
                  <Td>{emp.email}</Td>
                  <Td>{emp.department?.name || '—'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <HStack justify="center" mt={4}>
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} isDisabled={currentPage === 0}>
          Previous
        </Button>
        <Text>Page {currentPage + 1} of {totalPages}</Text>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          isDisabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>
        <Select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(0);
          }}
          width="100px"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>{size} / page</option>
          ))}
        </Select>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateEmployee onSuccess={() => {
              onClose();
              fetchEmployees();
            }} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default EmployeeList;
