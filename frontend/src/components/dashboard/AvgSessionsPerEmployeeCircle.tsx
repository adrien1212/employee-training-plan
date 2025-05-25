import React, { useEffect, useState } from 'react';
import { CircularProgress, CircularProgressLabel, Box, Text, VStack, Heading, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import api from '../../service/api';

const AvgSessionsPerEmployeeCircle = () => {
  const [avgSessions, setAvgSessions] = useState(0); // State to store the average value
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Function to fetch the average sessions per employee
    const fetchAvgSessions = async () => {
      try {
        const response = await api.get('v1/dashboard/avg-sessions-per-employee'); // Update with your actual API endpoint
        setAvgSessions(response.data); // Set the fetched data
      } catch (error) {
        console.error('Error fetching average sessions per employee:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchAvgSessions(); // Call the function to fetch the data
  }, []);

  return (
    <Box p={5} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <Heading size="md" mb={4}>
        Average Sessions per Employee
      </Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <VStack spacing={4} align="center">
          <CircularProgress
            value={avgSessions * 10} // Multiply by 10 to convert to percentage (assuming avgSessions is out of 10)
            color="teal.400"
            size="120px"
            thickness="8px"
          >
            <CircularProgressLabel fontSize="lg">{avgSessions}</CircularProgressLabel>
          </CircularProgress>
          <Text fontSize="lg" color="gray.600">Sessions per Employee</Text>
        </VStack>
      )}
    </Box>
  );
};

export default AvgSessionsPerEmployeeCircle;
