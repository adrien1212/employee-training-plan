// src/components/SessionList.tsx

import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Heading,
  Container,
  Text,
  HStack,
  Button,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

interface Session {
  id: number;
  title: string;
  date: string; // ISO 8601 string, e.g. "2025-06-01T14:00:00Z"
  speaker: string;
  status: string;

  // ─── NEW FIELDS FOR COMPLETED STATISTICS ─────────────────────────────────
  totalParticipants?: number;
  totalFeedBackGiven?: number;
  avgFeedbackRating?: number;
}

const ListSession = () => {
  const toast = useToast();
  const navigate = useNavigate();

  // ─── Active Sessions State ────────────────────────────────────────────
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [activeLoading, setActiveLoading] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [activePageSize, setActivePageSize] = useState(10);
  const [activeTotalPages, setActiveTotalPages] = useState(0);

  // ─── Not Started Sessions State ───────────────────────────────────────
  const [notStartedSessions, setNotStartedSessions] = useState<Session[]>([]);
  const [notStartedLoading, setNotStartedLoading] = useState(true);
  const [notStartedPage, setNotStartedPage] = useState(0);
  const [notStartedPageSize, setNotStartedPageSize] = useState(10);
  const [notStartedTotalPages, setNotStartedTotalPages] = useState(0);

  // ─── Completed Sessions State & Stats ─────────────────────────────────
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [completedLoading, setCompletedLoading] = useState(true);
  const [completedPage, setCompletedPage] = useState(0);
  const [completedPageSize, setCompletedPageSize] = useState(10);
  const [completedTotalPages, setCompletedTotalPages] = useState(0);

  // ─── Fetch helper (reused for Active/Not Started) ─────────────────────
  const fetchSessionsByStatus = async (
    status: string,
    page: number,
    size: number,
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        size,
        sessionStatus: status,
      };
      const res = await api.get("v1/sessions", { params });
      setSessions(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast({
        title: `Failed to load ${status.toLowerCase().replace("_", " ")} sessions`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Fetch Active Sessions ─────────────────────────────────────────────
  useEffect(() => {
    fetchSessionsByStatus(
      "ACTIVE",
      activePage,
      activePageSize,
      setActiveSessions,
      setActiveTotalPages,
      setActiveLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, activePageSize]);

  // ─── Fetch Not Started Sessions ────────────────────────────────────────
  useEffect(() => {
    fetchSessionsByStatus(
      "NOT_STARTED",
      notStartedPage,
      notStartedPageSize,
      setNotStartedSessions,
      setNotStartedTotalPages,
      setNotStartedLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notStartedPage, notStartedPageSize]);

  // ─── Fetch Completed Sessions + Statistics ─────────────────────────────
  useEffect(() => {
    const fetchCompleted = async () => {
      setCompletedLoading(true);
      try {
        // 1) Fetch the “page” of completed sessions
        const params: any = {
          page: completedPage,
          size: completedPageSize,
          sessionStatus: "COMPLETED",
        };
        const res = await api.get("v1/sessions", { params });
        const sessionsPage: Session[] = res.data.content;
        setCompletedTotalPages(res.data.totalPages);

        if (sessionsPage.length === 0) {
          setCompletedSessions([]);
          return;
        }

        // 2) For each session, call the statistics endpoint
        const statsPromises = sessionsPage.map((sess) =>
          api
            .get(`v1/statistics/sessions/${sess.id}`)
            .then((statRes) => ({
              id: sess.id,
              totalParticipants: statRes.data.totalParticipants,
              totalFeedBackGiven: statRes.data.totalFeedBackGiven,
              avgFeedbackRating: statRes.data.avgFeedbackRating,
            }))
            .catch(() => ({
              id: sess.id,
              totalParticipants: undefined,
              totalFeedBackGiven: undefined,
              avgFeedbackRating: undefined,
            }))
        );

        const statsArray = await Promise.all(statsPromises);

        // 3) Merge stats into each session object
        const sessionsWithStats = sessionsPage.map((sess) => {
          const stat = statsArray.find((s) => s.id === sess.id)!;
          return {
            ...sess,
            totalParticipants: stat.totalParticipants,
            totalFeedBackGiven: stat.totalFeedBackGiven,
            avgFeedbackRating: stat.avgFeedbackRating,
          };
        });

        setCompletedSessions(sessionsWithStats);
      } catch (err) {
        toast({
          title: "Failed to load completed sessions",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setCompletedLoading(false);
      }
    };

    fetchCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedPage, completedPageSize]);

  // ─── Generic “renderTable” with optional stats columns ─────────────────
  const renderTable = (
    sessions: Session[],
    loading: boolean,
    page: number,
    totalPages: number,
    pageSize: number,
    onPrev: () => void,
    onNext: () => void,
    onSizeChange: (newSize: number) => void,
    showStats: boolean
  ) => {
    if (loading) {
      return <Spinner size="xl" />;
    }

    if (sessions.length === 0) {
      return <Text>No sessions found.</Text>;
    }

    return (
      <>
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Title</Th>
                <Th>Date</Th>
                <Th>Speaker</Th>
                <Th>Status</Th>
                {showStats && <Th>Feedback Count</Th>}
                {showStats && <Th>Average Rating</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {sessions.map((session) => (
                <Tr
                  key={session.id}
                  onClick={() => navigate(`/sessions/${session.id}`)}
                  _hover={{ bg: "teal.100", cursor: "pointer" }}
                >
                  <Td>{session.id}</Td>
                  <Td>{session.title}</Td>
                  <Td>
                    {new Date(session.date).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Td>
                  <Td>{session.speaker}</Td>
                  <Td>{session.status}</Td>

                  {showStats && (
                    <>
                      <Td>
                        {session.totalFeedBackGiven != null &&
                        session.totalParticipants != null
                          ? `${session.totalFeedBackGiven}/${session.totalParticipants}`
                          : "—"}
                      </Td>
                      <Td>
                        {session.avgFeedbackRating != null
                          ? session.avgFeedbackRating.toFixed(2)
                          : "—"}
                      </Td>
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <HStack justify="center" mt={4}>
          <Button onClick={onPrev} isDisabled={page === 0 || loading}>
            Previous
          </Button>
          <Text>
            Page {page + 1} of {totalPages}
          </Text>
          <Button
            onClick={onNext}
            isDisabled={page >= totalPages - 1 || loading}
          >
            Next
          </Button>
          <Select
            value={pageSize}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            width="100px"
            isDisabled={loading}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </Select>
        </HStack>
      </>
    );
  };

  return (
    <Container maxW="6xl" py={10}>
      {/* ─── Active Sessions (no stats) ────────────────────────────────────── */}
      <Heading mb={4}>Active Sessions</Heading>
      {renderTable(
        activeSessions,
        activeLoading,
        activePage,
        activeTotalPages,
        activePageSize,
        () => setActivePage((prev) => Math.max(prev - 1, 0)),
        () => setActivePage((prev) => Math.min(prev + 1, activeTotalPages - 1)),
        (newSize) => {
          setActivePageSize(newSize);
          setActivePage(0);
        },
        false // → do NOT show stats
      )}

      {/* ─── Other Sessions in Tabs ───────────────────────────────────────── */}
      <Heading mt={10} mb={4}>
        Other Sessions
      </Heading>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Not Started</Tab>
          <Tab>Completed</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0} pt={4}>
            {/* Not Started (no stats) */}
            {renderTable(
              notStartedSessions,
              notStartedLoading,
              notStartedPage,
              notStartedTotalPages,
              notStartedPageSize,
              () => setNotStartedPage((prev) => Math.max(prev - 1, 0)),
              () =>
                setNotStartedPage((prev) =>
                  Math.min(prev + 1, notStartedTotalPages - 1)
                ),
              (newSize) => {
                setNotStartedPageSize(newSize);
                setNotStartedPage(0);
              },
              false // → do NOT show stats
            )}
          </TabPanel>

          <TabPanel p={0} pt={4}>
            {/* Completed (WITH stats) */}
            {renderTable(
              completedSessions,
              completedLoading,
              completedPage,
              completedTotalPages,
              completedPageSize,
              () => setCompletedPage((prev) => Math.max(prev - 1, 0)),
              () =>
                setCompletedPage((prev) =>
                  Math.min(prev + 1, completedTotalPages - 1)
                ),
              (newSize) => {
                setCompletedPageSize(newSize);
                setCompletedPage(0);
              },
              true // → show stats
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ListSession;
