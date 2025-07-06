import { ModeSignature } from "./ModeSignature";
import { SessionStatus } from "./SessionStatus";
import { SessionStatusHistory } from "./SessionStatusHistory";

export interface SessionDetail {
  id: number;
  startDate: string;      // ISO 8601, e.g. "2025-06-01T14:00:00Z"
  endDate: string; 
  location: string;
  status: SessionStatus;
  accessToken: string;
  training : {
    id: number;
    title: string;
  }
  sessionStatusHistory: SessionStatusHistory[]
  trainerId: number;
  modeSignature: ModeSignature
}