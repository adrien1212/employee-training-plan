import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Container,
} from '@chakra-ui/react';

interface Props {
  onCreated: (companyId: number) => void;
}

interface FormData {
  name: string;
  email: string;
  location: string;
}

const CreateCompany: React.FC<Props> = ({ onCreated }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    location: '',
  });

  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await new Promise<{ data: { id: number } }>((resolve) =>
        setTimeout(() => resolve({ data: { id: Math.floor(Math.random() * 1000) } }), 1000)
      );      const newCompany = res.data;
      toast({
        title: 'Company created.',
        description: `ID: ${newCompany.id}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onCreated(newCompany.id); // Trigger redirect
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not create company',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  return (
    <Container maxW="md" py={10}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={6}>
          Create Company
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Company Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter company email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter company location"
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full">
              Create Company
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default CreateCompany;
