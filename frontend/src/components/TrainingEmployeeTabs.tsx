import {
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Thead, Tr, Th, Td, Tbody, Heading, Spinner, Text
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import api from '../service/api';

interface Props {
  trainingId: string;
}

interface SessionEnrollment {
  id: number;
  session: Session;
  employee: Employee;
  completed: boolean;
}

interface Session {
  id: number;
  startDate: string;
  endDate: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department?: Department;
}

interface Department {
  id: number,
  name: string
}

const TrainingEmployeeTabs: React.FC<Props> = ({ trainingId }) => {
  const [completed, setCompleted] = useState<SessionEnrollment[]>([]);
  const [current, setCurrent] = useState<SessionEnrollment[]>([]);
  const [scheduled, setScheduled] = useState<SessionEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0); // Track selected tab

  const fetchData = async (status: string) => {
    setLoading(true);
    try {
      const res = await api.get(`v1/sessions-enrollment?trainingId=${trainingId}&sessionStatus=${status}`);
      switch (status) {
        case 'COMPLETED':
          setCompleted(res.data);
          break;
        case 'ACTIVE':
          setCurrent(res.data);
          break;
        case 'NOT_STARTED':
          setScheduled(res.data);
          break;
        default:
          break;
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load the data for the default tab (completed)
    fetchData('COMPLETED');
  }, [trainingId]);

  const handleTabChange = (index: number) => {
    setSelectedTabIndex(index);

    // Reload the data based on the selected tab
    switch (index) {
      case 0:
        fetchData('COMPLETED');
        break;
      case 1:
        fetchData('ACTIVE');
        break;
      case 2:
        fetchData('NOT_STARTED');
        break;
      default:
        break;
    }
  };

  const renderEmployeeTable = (sessionEnrollments: SessionEnrollment[]) => {
    if (!sessionEnrollments.length) return <Text>No session enrollment found.</Text>;

    return (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Session Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sessionEnrollments.map((enrollment) => (
            <Tr key={enrollment.id}>
              <Td>{enrollment.employee.firstName} {enrollment.employee.lastName}</Td>
              <Td>{enrollment.employee.email}</Td>
              <Td>{enrollment.session.startDate}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

  return (
    <>
      <Heading size="md" mt={10} mb={2}>Employee Participation</Heading>
      {loading ? (
        <Spinner size="md" />
      ) : (
        <Tabs
          variant="enclosed"
          mt={2}
          w="100%"
          index={selectedTabIndex}
          onChange={handleTabChange} // Listen to tab change event
        >
          <TabList>
            <Tab>Completed</Tab>
            <Tab>Ongoing</Tab>
            <Tab>Scheduled</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{renderEmployeeTable(completed)}</TabPanel>
            <TabPanel>{renderEmployeeTable(current)}</TabPanel>
            <TabPanel>{renderEmployeeTable(scheduled)}</TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </>
  );
};

export default TrainingEmployeeTabs;
