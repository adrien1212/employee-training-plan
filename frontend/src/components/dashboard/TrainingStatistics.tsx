// src/components/TrainingStatistics.tsx

import { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Heading,
  Container,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import api from "../../service/api";

interface BetterSessionStatisticsData {
  // Adjust these fields if your backend returns additional properties
  id?: number;
  // If your session statistics include a title or name, uncomment next line
  // title?: string;
  status: string;
  totalParticipants: number;
  totalFeedBackGiven: number;
  avgFeedbackRating: number;
}

interface BetterTrainingStatisticData {
  trainingTitle: string;
  totalSessions: number;
  totalCompletedSessions: number;
  totalEmployeesTrained: number;
  totalFeedbackGiven: number;
  avgFeedbackRating: number;
  sessionsStatistics: BetterSessionStatisticsData[];
}

const TrainingStatistics = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [stats, setStats] = useState<BetterTrainingStatisticData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainingStats = async () => {
      setLoading(true);
      try {
        const res = await api.get<BetterTrainingStatisticData>(`v1/statistics/trainings/${id}`);
        setStats(res.data);
      } catch (err) {
        toast({
          title: "Failed to load training statistics",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingStats();
  }, [id, toast]);

  if (loading) {
    return (
      <Container maxW="4xl" py={10} textAlign="center">
        <Spinner size="xl" />
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container maxW="4xl" py={10}>
        <Text>No statistics available.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={10}>
      {/* ─── Training Title ─────────────────────────────────────────────────── */}
      <Heading mb={6}>{stats.trainingTitle}</Heading>

      {/* ─── Summary Stats ──────────────────────────────────────────────────── */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
        <Stat>
          <StatLabel>Total Sessions</StatLabel>
          <StatNumber>{stats.totalSessions}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Completed Sessions</StatLabel>
          <StatNumber>{stats.totalCompletedSessions}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Employees Trained</StatLabel>
          <StatNumber>{stats.totalEmployeesTrained}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Total Feedback Given</StatLabel>
          <StatNumber>{stats.totalFeedbackGiven}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Average Feedback Rating</StatLabel>
          <StatNumber>
            {stats.avgFeedbackRating.toFixed(2)}
          </StatNumber>
        </Stat>
      </SimpleGrid>

      {/* ─── Per-Session Statistics Table ───────────────────────────────────── */}
      <Box overflowX="auto">
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Session ID</Th>
              {/* If your sessionsStatistics include a title field, uncomment: */}
              {/* <Th>Session Title</Th> */}
              <Th>Status</Th>
              <Th>Participants</Th>
              <Th>Feedback Count</Th>
              <Th>Avg Rating</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stats.sessionsStatistics.map((sessionStat) => (
              <Tr key={sessionStat.id ?? Math.random()}>
                <Td>{sessionStat.id ?? "—"}</Td>
                {/* <Td>{sessionStat.title ?? "—"}</Td> */}
                <Td>{sessionStat.status}</Td>
                <Td>{sessionStat.totalParticipants}</Td>
                <Td>{`${sessionStat.totalFeedBackGiven}/${sessionStat.totalParticipants}`}</Td>
                <Td>{sessionStat.avgFeedbackRating.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default TrainingStatistics;
