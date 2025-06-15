import api from "@/services/api";
import { useQuery } from "react-query";

// reuseable key factory
export const signatureKey = (
    slotSignatureId: number,
    sessionEnrollmentId: number
) => ["existSignature", slotSignatureId, sessionEnrollmentId] as const;

// raw fetcher, so you can also call it in useQueries
export const fetchExistSignature = (
    slotSignatureId: number,
    sessionEnrollmentId: number
): Promise<boolean> =>
    api
        .get<boolean>("/v1/signatures/is-signed", {
            params: { slotSignatureId, sessionEnrollmentId },
        })
        .then((res) => res.data);

// traditional hook for a single (slot, enrollment) pair
export function useExistSignature(
    slotSignatureId?: number,
    sessionEnrollmentId?: number
) {
    return useQuery<boolean, Error>(
        signatureKey(slotSignatureId!, sessionEnrollmentId!),
        () => fetchExistSignature(slotSignatureId!, sessionEnrollmentId!),
        {
            enabled: Boolean(slotSignatureId && sessionEnrollmentId),
            staleTime: 0,
        }
    );
}