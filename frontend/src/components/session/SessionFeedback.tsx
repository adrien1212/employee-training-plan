// src/components/SessionFeedback.tsx

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Flex,
  useToast,
} from '@chakra-ui/react';
import api from '../../service/api';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EmployeeResponseModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: { id: number; name: string };
}

interface FeedbackResponseModel {
  id: number;
  comment: string;
  rating?: number; // 1 through 5
  employee: EmployeeResponseModel;
  submittedAt: string; // ISO 8601
}

interface SessionFeedbackProps {
  sessionId: string;
}

const COLORS = ['#FF6384', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB'];

const SessionFeedback: React.FC<SessionFeedbackProps> = ({ sessionId }) => {
  const toast = useToast();
  const [feedbacks, setFeedbacks] = useState<FeedbackResponseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [notComplete, setNotComplete] = useState(false);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setNotComplete(false);
    try {
      const res = await api.get<FeedbackResponseModel[]>(`v1/feedbacks`, {
        params: { sessionId },
      });
      setFeedbacks(res.data);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || '';
      if (message.includes('Session is not complete')) {
        setNotComplete(true);
      } else {
        toast({
          title: 'Failed to load feedbacks',
          description: 'Could not fetch session feedback.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Count ratings 1–5
  const ratingCounts = [0, 0, 0, 0, 0]; // index 0→rating1, …,4→rating5
  feedbacks.forEach((fb) => {
    const r = fb.rating;
    if (r && r >= 1 && r <= 5) {
      ratingCounts[r - 1]++;
    }
  });

  const data = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [
      {
        data: ratingCounts,
        backgroundColor: COLORS,
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const label = context.label || '';
            const total = ratingCounts.reduce((sum, c) => sum + c, 0);
            const percentage = total ? ((value / total) * 100).toFixed(0) : '0';
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Box width="100%" mt={8}>
      <Heading size="sm" mb={4}>
        Feedbacks
      </Heading>

      {loading ? (
        <Spinner size="md" />
      ) : notComplete ? (
        <Text>Please complete the session.</Text>
      ) : feedbacks.length === 0 ? (
        <Text>No feedback found.</Text>
      ) : (
        <VStack spacing={6} align="stretch">
          {/* Pie Chart */}
          <Box width="100%" maxW="400px" mx="auto" mb={4}>
            <Pie data={data} options={options} />
          </Box>

          {/* Feedback Cards */}
          {feedbacks.map((fb) => (
            <Box
              key={fb.id}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              boxShadow="sm"
              bg="white"
            >
              <VStack align="start" spacing={2}>
                <Flex justify="space-between" width="100%">
                  <Text fontSize="sm" color="gray.500">
                    {new Date(fb.submittedAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Flex>
                <Text whiteSpace="pre-wrap" mb={3}>
                  {fb.comment}
                </Text>
                <Box textAlign="right">
                  <Text fontWeight="bold">Rating: {fb.rating ?? '–'}</Text>
                </Box>
              </VStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default SessionFeedback;
