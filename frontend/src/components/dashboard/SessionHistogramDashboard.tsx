import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../service/api';
import { Spinner, Text, Box, Heading } from '@chakra-ui/react';

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SessionResponseModel {
  id: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'NOT_STARTED';
}

interface SessionDashboardData {
  month: number;
  totalSessions: number;
  sessions: SessionResponseModel[];
}

const SessionHistogramDashboard: React.FC = () => {
  const [sessionData, setSessionData] = useState<SessionDashboardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await api.get('v1/dashboard/sessions');
        setSessionData(response.data);
      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, []);

  const generateChartData = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const activeSessions = new Array(12).fill(0);
    const completedSessions = new Array(12).fill(0);
    const notStartedSessions = new Array(12).fill(0);

    // Fill session counts based on fetched data
    sessionData.forEach(data => {
      if (data.month >= 1 && data.month <= 12) {
        // Count sessions based on their status
        data.sessions.forEach(session => {
          switch (session.status) {
            case 'ACTIVE':
              activeSessions[data.month - 1] += 1;
              break;
            case 'COMPLETED':
              completedSessions[data.month - 1] += 1;
              break;
            case 'NOT_STARTED':
              notStartedSessions[data.month - 1] += 1;
              break;
            default:
              break;
          }
        });
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Active Sessions',
          data: activeSessions,
          backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
        },
        {
          label: 'Completed Sessions',
          data: completedSessions,
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green
        },
        {
          label: 'Not Started Sessions',
          data: notStartedSessions,
          backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
        },
      ],
    };
  };

  return (
    <Box p={5}>
      <Heading size="md" mb={4}>Session Dashboard - Histogram</Heading>
      {loading ? (
        <Spinner size="md" />
      ) : sessionData.length === 0 ? (
        <Text>No session data available for the current year.</Text>
      ) : (
        <Bar 
          data={generateChartData()} 
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Sessions per Month (Current Year)',
              },
              legend: {
                position: 'top',
              },
            },
          }}
        />
      )}
    </Box>
  );
};

export default SessionHistogramDashboard;
