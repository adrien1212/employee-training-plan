import React from 'react';
import SessionHistogramDashboard from '../components/dashboard/SessionHistogramDashboard'; // Importing the session histogram component
import DepartmentList from '../components/DepartmentList'; // Importing the department list component
import { Box, Heading } from '@chakra-ui/react';
import AvgSessionsPerEmployeeCircle from '../components/dashboard/AvgSessionsPerEmployeeCircle';

const DashboardPage: React.FC = () => {
  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>
        Dashboard Overview
      </Heading>

      {/* Session Dashboard */}
      <Box mb={8}>
        <Heading size="md" mb={4}>
          Session Dashboard
        </Heading>
        <SessionHistogramDashboard />
      </Box>

      {/* Department List Dashboard */}
      <Box mb={8}>
        <Heading size="md" mb={4}>
          Department List
        </Heading>
      </Box>

      {/* You can add other dashboards here */}
    <Box mb={8}>
        <Heading size="md" mb={4}>
          Department List
        </Heading>
        <AvgSessionsPerEmployeeCircle />
      </Box>
    </Box>
  );
};

export default DashboardPage;
