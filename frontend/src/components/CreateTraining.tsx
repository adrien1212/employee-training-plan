import { useEffect, useState } from 'react';
import {
  Box, Button, Checkbox, CheckboxGroup, FormControl,
  FormLabel, Heading, Input, Stack, Textarea,
  useToast, Container
} from '@chakra-ui/react';
import api from '../service/api';

interface Department {
  id: number;
  name: string;
}

const CreateTraining = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    provider: '',
    departmentId: [] as number[],
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/v1/companies/departments');
        setDepartments(res.data);
      } catch (err) {
        toast({
          title: 'Impossible to fetch departments',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (selected: string[]) => {
    setFormData(prev => ({
      ...prev,
      departmentId: selected.map(Number),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Replace with actual backend
      await api.post('/v1/trainings', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Training created!',
        description: formData.title,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        title: '',
        description: '',
        provider: '',
        departmentId: [],
      });
    } catch (err) {
      toast({
        title: 'Error creating training',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="lg" py={10}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={6}>Create Training</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel>Provider</FormLabel>
            <Input
              name="provider"
              value={formData.provider}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel>Departments</FormLabel>
            <CheckboxGroup
              value={formData.departmentId.map(String)}
              onChange={handleDepartmentChange}
            >
              <Stack spacing={2}>
                {departments.map(dep => (
                  <Checkbox key={dep.id} value={String(dep.id)}>
                    {dep.name}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">
            Create Training
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateTraining;
