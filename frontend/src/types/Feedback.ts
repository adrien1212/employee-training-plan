import { SessionEnrollment } from "./SessionEnrollment";

export interface Feedback {
  id: number;
  comment: string;
  rating?: number; // 1 through 5
  submittedAt: string;
  sessionEnrollmentId: number;
}