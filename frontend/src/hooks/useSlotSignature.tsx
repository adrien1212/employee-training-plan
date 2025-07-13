import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Feedback } from '@/types/Feedback';
import { Training } from '@/types/Training';
import { SlotSignature } from '@/types/SlotSignature';
import { SessionEnrollment } from '@/types/SessionEnrollment';

interface Options {
    sessionId?: number;
    page?: number;
    size?: number;
}

function useSlotsSignature({
    sessionId,
    page = 0,
    size = 10,
}: Options) {
    const key = ['slots', sessionId, page];
    const queryFn = () =>
        api
            .get<PageResponse<SlotSignature>>('/v1/slots-signature', {
                params: {
                    sessionId,
                    page,
                    size,
                },
            })
            .then(res => res.data);

    const { data, isLoading, error } = useQuery(key, queryFn, {
        keepPreviousData: true,
    });

    return {
        data,
        isLoading,
        error,
    };
}

export function useOpenSignature() {
    const queryClient = useQueryClient();

    return useMutation(
        (id: number) =>
            api
                .post<SlotSignature>(`/v1/slots-signature/open-signature/${id}`)
                .then(res => res.data),
        {
            // After opening a signature, invalidate the slots list so it refetches
            onSuccess: () => {
                queryClient.invalidateQueries('slots');
            },
        }
    );
}

/**
 * Fetch missing signatures for a specific slot signature ID
 */
export function useMissingSignatures(slotSignatureId: number) {
    const key = ['missingSignatures', slotSignatureId]
    const queryFn = () =>
        api
            .get<PageResponse<SessionEnrollment>>(`/v1/slots-signature/${slotSignatureId}/missing-signatures`)
            .then(res => res.data)

    const { data, isLoading, error } = useQuery(key, queryFn)
    return { data, isLoading, error }
}

export default useSlotsSignature
