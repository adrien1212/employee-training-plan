import { SessionStatus } from "./SessionStatus";

export interface SessionStatusHistory {
    id: number,
    changedAt: string,
    updatedBy: string,
    status: SessionStatus
}