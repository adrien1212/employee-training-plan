import { useState, useEffect } from 'react';
import {
  Box, Button, FormControl, FormLabel,
  Input, Select, Heading, VStack, useToast, Container
} from '@chakra-ui/react';
import api from '../service/api';

interface Department {
  id: number;
  name: string;
}

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const toast = useToast();

  useEffect(() => {
    // Fetch departments (mock if backend is off)
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/v1/companies/departments');
        setDepartments(res.data);
      } catch (err) {
        // fallback mock
        setDepartments([
          { id: 1, name: 'Engineering' },
          { id: 2, name: 'HR' },
        ]);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/v1/employees", formData);

      toast({
        title: 'Employee created!',
        description: `${formData.firstName} ${formData.lastName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        departmentId: '',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not create employee',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" py={10}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={6}>Create Employee</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Department</FormLabel>
              <Select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                placeholder="Select department"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full">
              Create Employee
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default CreateEmployee;
