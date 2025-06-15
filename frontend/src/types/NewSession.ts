import { SessionStatus } from "./SessionStatus";

export interface NewSession {
    startDate: string,
    endDate: string,
    location: string,
    status: SessionStatus
    trainerId: number
}