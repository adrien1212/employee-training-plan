import { PublicSessionEnrollment } from "./PublicSessionEnrollment.ts";
import { PublicSlotSignature } from "./PublicSlotSignature.ts";


export interface PublicSession {
    id: number;
    startDate: string;
    endDate: string;
    location: string;
    status: string;
    accessToken: string;
    training: {
        id: number;
        name: string;
    };
    sessionsEnrollment: PublicSessionEnrollment[];
    slotsSignature: PublicSlotSignature[];
}