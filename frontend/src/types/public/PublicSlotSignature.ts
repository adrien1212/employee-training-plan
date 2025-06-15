import { SlotSignature } from "../SlotSignature";

export type PublicSlotSignature = SlotSignature & {
  trainingName: string;
  startDate: string
  endDate: string,
  location: string
};