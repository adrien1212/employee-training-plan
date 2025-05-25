import { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel,
  Heading, Input, useToast, Container
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import api from '../service/api';
import TrainingSessionTabs from './TrainingSessionTabs';

const CreateSession = () => {
  const { trainingId } = useParams(); // from route: /trainings/:trainingId/sessions/new
  const toast = useToast();

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`v1/trainings/${trainingId}/sessions`, formData);

      toast({
        title: 'Session created!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFormData({ startDate: '', endDate: '' });
    } catch (err) {
      toast({
        title: 'Error creating session',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  return (
    <Container maxW="lg" py={10}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={6}>Create Session for Training #{trainingId}</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired mb={4}>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">
            Create Session
          </Button>
        </form>
      </Box>
      {trainingId && <TrainingSessionTabs trainingId={trainingId} />}
    </Container>
  );
};

export default CreateSession;
