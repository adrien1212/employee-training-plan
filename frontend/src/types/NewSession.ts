import { ModeSignature } from "./ModeSignature";
import { SessionStatus } from "./SessionStatus";

export interface NewSession {
    startDate: string,
    endDate: string,
    location: string,
    status: SessionStatus
    modeSignature: ModeSignature
    trainerId: number
}