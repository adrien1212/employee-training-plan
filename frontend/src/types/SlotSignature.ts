import { SlotSignatureStatus } from "./SlotSignatureStatus"

export interface SlotSignature {
    id: number
    sessionId: number
    slotDate: string,
    periode: string,
    token: string,
    status: SlotSignatureStatus
}