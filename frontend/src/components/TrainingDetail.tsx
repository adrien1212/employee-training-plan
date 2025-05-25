import { useEffect, useState, useCallback } from 'react';
import {
  Box, Container, Heading, Text, VStack, Spinner, Button, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Select, Input, HStack, Divider
} from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import TrainingEmployeeTabs from './TrainingEmployeeTabs';
import TrainingSessionTabs from './TrainingSessionTabs';
import api from '../service/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Department {
  id: number;
  name: string;
}

interface Session {
  session: number;
  startDate: string;
  endDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

interface Training {
  id: number;
  title: string;
  description: string;
  provider: string;
  departments: Department[];
}

interface SessionWithSessionEnrollment {
  session : Session,
  numberOfEnrollments: number;
}

interface TrainingStatistics {
  startDate: string;
  endDate: string;
  employeesConducted: number;
  sessions: SessionWithSessionEnrollment[];
}

const TrainingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [training, setTraining] = useState<Training | null>(null);
  const [statistics, setStatistics] = useState<TrainingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);

  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-01-01'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-12-31'));

  const fetchTraining = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get<Training>(`/v1/trainings/${id}`);
      setTraining(res.data);
    } catch {
      toast({
        title: 'Error fetching training.',
        status: 'error',
        duration: 3000,
      });
    }
  }, [id, toast]);

  const fetchTrainingStats = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get<TrainingStatistics>(
        `/v1/statistics/trainings/${id}?startDate=${startDate}&endDate=${endDate}`
      );
      setStatistics(res.data);
    } catch {
      toast({
        title: 'Error fetching training statistics.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [id, startDate, endDate, toast]);

  useEffect(() => {
    fetchTraining();
    fetchTrainingStats();

    const fetchDepartments = async () => {
      try {
        const res = await api.get('v1/departments');
        setAvailableDepartments(res.data);
      } catch {
        toast({
          title: 'Error fetching departments.',
          status: 'error',
          duration: 3000,
        });
      }
    };

    fetchDepartments();
  }, [fetchTraining, fetchTrainingStats]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !id) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await axios.post(`http://localhost:8080/api/trainings/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadedFileName(file.name);
      toast({
        title: 'PDF uploaded successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Upload failed.',
        description: 'Could not upload PDF file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  }, [id, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleAddDepartment = async () => {
    if (!selectedDepartmentId || !id) return;

    try {
      const res = await api.post(`/v1/trainings/${id}/departments`, {
        departmentId: selectedDepartmentId,
      });

      setTraining((prev) =>
        prev ? { ...prev, departments: [...prev.departments, res.data] } : prev
      );

      toast({
        title: 'Department added.',
        status: 'success',
        duration: 3000,
      });

      setModalOpen(false);
      setSelectedDepartmentId(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Could not add department.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getEnrollmentChartData = () => {
    if (!statistics) return null;

    const months = Array(12).fill(0);
    statistics.sessions.forEach(session => {
      const month = new Date(session.session.startDate).getMonth();
      months[month] += session.numberOfEnrollments || 0;
    });

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Employees Trained by Month',
          data: months,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    };
  };

  if (loading || !training || !statistics) return <Spinner size="xl" />;

  return (
    <Container maxW="xl" py={10}>
      <VStack spacing={4} align="start">
        <Heading>{training.title}</Heading>
        <Text><strong>Provider:</strong> {training.provider}</Text>
        <Text><strong>Description:</strong> {training.description}</Text>
        <Text>
          <strong>Departments:</strong>{' '}
          {training.departments.map((dept) => dept.name).join(', ')}
          <Button onClick={() => setModalOpen(true)} size="xs" ml={2} colorScheme="teal">+</Button>
        </Text>

        <Divider />

        <HStack>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button colorScheme="teal" onClick={fetchTrainingStats}>
            Refresh
          </Button>
        </HStack>

        <Text><strong>Employees Trained:</strong> {statistics.employeesConducted}</Text>

        <Box w="100%" mt={4}>
          <Heading size="md" mb={2}>Training Histogram</Heading>
          <Bar data={getEnrollmentChartData()} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Employee Training by Month' } } }} />
        </Box>

        <Button
          as={RouterLink}
          to={`/trainings/${id}/sessions/new`}
          colorScheme="teal"
          size="sm"
        >
          + Add New Session
        </Button>

        <Button
          as={RouterLink}
          to={`/trainings/${id}/employee/new`}
          colorScheme="teal"
          size="sm"
        >
          + Add Employee
        </Button>

        <Heading size="md" mt={6}>Upload Training PDF</Heading>
        <Box
          {...getRootProps()}
          border="2px dashed teal"
          p={6}
          w="100%"
          textAlign="center"
          borderRadius="md"
          bg={isDragActive ? 'teal.50' : 'gray.50'}
          cursor="pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Text>Drop the PDF file here...</Text>
          ) : (
            <Text>Drag & drop a PDF file here, or click to select one</Text>
          )}
        </Box>
        {uploadedFileName && (
          <Text fontSize="sm" color="green.600">Uploaded: {uploadedFileName}</Text>
        )}

        {id && <TrainingSessionTabs trainingId={id} />}
        {id && <TrainingEmployeeTabs trainingId={id} />}
      </VStack>

      {/* Add Department Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Department</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Select department"
              onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
            >
              {availableDepartments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddDepartment}>
              Add
            </Button>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default TrainingDetail;