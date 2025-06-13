// src/components/SessionEnrollments.tsx

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  useToast,
  Button,
} from '@chakra-ui/react';
import api from '../../service/api';

interface DepartmentResponseModel {
  id: number;
  name: string;
}

interface EmployeeResponseModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: DepartmentResponseModel;
}

interface SessionEnrollmentResponseModel {
  id: number;
  employee: EmployeeResponseModel;
  completed: boolean;
  feedbackToken: string;
}

interface SessionEnrollmentsProps {
  sessionId: string;
}

const SessionEnrollments: React.FC<SessionEnrollmentsProps> = ({ sessionId }) => {
  const toast = useToast();
  const [enrollments, setEnrollments] = useState<SessionEnrollmentResponseModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await api.get<SessionEnrollmentResponseModel[]>(
        `v1/sessions-enrollment`,
        { params: { sessionId } }
      );
      setEnrollments(res.data);
    } catch {
      toast({
        title: 'Failed to load enrollments',
        description: 'Could not fetch session enrollments.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const sendFollowUp = (enrollmentId: number) => {
    // Placeholder: call API to send follow-up email
    toast({
      title: 'Follow-up email sent',
      description: `Email sent for enrollment ID ${enrollmentId}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    fetchEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <Box width="100%" mt={8}>
      <Heading size="sm" mb={4}>
        Enrollments
      </Heading>

      {loading ? (
        <Spinner size="md" />
      ) : enrollments.length === 0 ? (
        <Text>No enrollments found.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Feedback Token</Th>
              <Th>Completed</Th>
              <Th>Follow-up Email</Th>
            </Tr>
          </Thead>
          <Tbody>
            {enrollments.map((enr) => (
              <Tr key={enr.id}>
                <Td>{enr.employee.firstName}</Td>
                <Td>{enr.employee.lastName}</Td>
                <Td>{enr.feedbackToken}</Td>
                <Td>{enr.completed ? 'Yes' : 'No'}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => sendFollowUp(enr.id)}
                    isDisabled={enr.completed}
                  >
                    Send Email
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default SessionEnrollments;
