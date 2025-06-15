import { Employee } from "./Employee";
import { SessionDetail } from "./SessionDetail";

export interface SessionEnrollment {
  id: number;
  session: SessionDetail;
  employee: Employee;
  hasFeedback: boolean;
  hasSigned: boolean
  feedback?: {
    id: number;
    rating: number;
    comment: string;
  };
  sessionEnrollmentToken: string;
}