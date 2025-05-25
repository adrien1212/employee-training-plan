import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Heading, Text, Spinner, VStack, Container, useToast, Divider, List, ListItem, Badge,
  Button
} from '@chakra-ui/react';
import api from '../service/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, PointElement, LineElement
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

interface Department {
  id: number
  name: string
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department?: Department;
}

interface Session {
  id: number;
  startDate: string;
  endDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

interface SessionEnrollment {
  id: number;
  completed: boolean;
  session: Session;
}

interface EmployeeStatistics {
  employee: Employee;
  totalSessionEnrolled: number;
  sessionEnrollments: SessionEnrollment[];
  totalTraininsDays: number;
  startDate: string;
  endDate: string;
}

// AJOUT DE L'INTERFACE TRAINING
interface Training {
  id: number;
  title: string;
  description?: string;
  departmentId: number;
  // autres champs si besoin
}

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState<EmployeeStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  // AJOUT DE L'ÉTAT POUR LES TRAININGS
  const [availableTrainings, setAvailableTrainings] = useState<Training[]>([]);
  const [loadingTrainings, setLoadingTrainings] = useState(false);

  const [startDate] = useState<string>(format(new Date(), 'yyyy-01-01'));
  const [endDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // 1er useEffect : charge les statistiques employé
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await api.get<EmployeeStatistics>(
          `/v1/statistics/employees/${id}?startDate=${startDate}&endDate=${endDate}`
        );
        setStatistics(res.data);
      } catch (err) {
        toast({
          title: 'Failed to load employee statistics',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [id, startDate, endDate, toast]);

  // 2e useEffect : charge les trainings disponibles si le département est connu
  useEffect(() => {
    const fetchAvailableTrainings = async () => {
      if (statistics?.employee.department) {
        setLoadingTrainings(true);
        try {
          const res = await api.get<Training[]>(
            `/v1/employees/${statistics.employee.id}/training/no-enrolled?status=NOT_STARTED`
          );
          setAvailableTrainings(res.data);
        } catch (err) {
          toast({
            title: 'Failed to load available trainings',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoadingTrainings(false);
        }
      }
    };

    fetchAvailableTrainings();
  }, [statistics?.employee.department, toast]);

  const getSessionsByMonth = () => {
    const months = Array(12).fill(0);
    statistics?.sessionEnrollments.forEach(({ session }) => {
      const month = new Date(session.startDate).getMonth();
      months[month] += 1;
    });
    return months;
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sessions by Month',
        data: getSessionsByMonth(),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Training Sessions by Month' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Container maxW="4xl" py={10}>
      {loading ? (
        <Spinner size="xl" />
      ) : statistics ? (
        <VStack align="start" spacing={6}>
          <Box>
            <Heading size="lg">Employee Details</Heading>
            <Text><strong>ID:</strong> {statistics.employee.id}</Text>
            <Text><strong>Name:</strong> {statistics.employee.firstName} {statistics.employee.lastName}</Text>
            <Text><strong>Email:</strong> {statistics.employee.email}</Text>
            <Text><strong>Department:</strong> {statistics.employee.department?.name || '—'}</Text>
            <Text><strong>Total Sessions Enrolled:</strong> {statistics.totalSessionEnrolled}</Text>
            <Text><strong>Total Training Days:</strong> {statistics.totalTraininsDays}</Text>
          </Box>

          <Divider />

          <Box>
            <Heading size="md" mb={2}>Training Enrollments</Heading>
            {statistics.sessionEnrollments.length === 0 ? (
              <Text>No training sessions found for this period.</Text>
            ) : (
              <List spacing={3}>
                {statistics.sessionEnrollments.map(({ id, completed, session }) => (
                  <ListItem key={id} borderWidth="1px" borderRadius="lg" p={3}>
                    <Text><strong>Session ID:</strong> {session.id}</Text>
                    <Text><strong>Dates:</strong> {new Date(session.startDate).toLocaleDateString()} → {new Date(session.endDate).toLocaleDateString()}</Text>
                    <Text>
                      <strong>Status:</strong>{' '}
                      <Badge colorScheme={
                        session.status === 'COMPLETED' ? 'green' :
                        session.status === 'IN_PROGRESS' ? 'yellow' : 'gray'
                      }>
                        {session.status}
                      </Badge>
                    </Text>
                    <Text>
                      <strong>Completed:</strong>{' '}
                      <Badge colorScheme={completed ? 'green' : 'red'}>
                        {completed ? 'Yes' : 'No'}
                      </Badge>
                    </Text>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Divider />

          <Box>
            <Heading size="md" mb={2}>Sessions by Month</Heading>
            <Line data={chartData} options={chartOptions} />
          </Box>

          <Divider />

          {/* NOUVEL ESPACE POUR LES TRAININGS DISPONIBLES */}
          <Box>
            <Heading size="md" mb={2}>Available Trainings</Heading>
            {loadingTrainings ? (
              <Spinner size="md" />
            ) : availableTrainings.length === 0 ? (
              <Text>No available trainings found for this department.</Text>
            ) : (
              <List spacing={3}>
                {availableTrainings.map((training) => (
                  <ListItem key={training.id} borderWidth="1px" borderRadius="lg" p={3}>
                    <Text><strong>Title:</strong> {training.title}</Text>
                    {training.description && (
                      <Text><strong>Description:</strong> {training.description}</Text>
                    )}
                    <Button
                      mt={2}
                      colorScheme="teal"
                      size="sm"
                      onClick={() => {
                        // Redirect and pass current employee id in location.state
                        if (statistics?.employee?.id) {
                          navigate(`/trainings/${training.id}/employee/new`, {
                            state: { autoSelectEmployeeId: statistics.employee.id },
                          });
                        }
                      }}
                    >
                      Add Employee to This Training
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </VStack>
      ) : (
        <Text>Employee not found.</Text>
      )}
    </Container>
  );
};

export default EmployeeDetail;
