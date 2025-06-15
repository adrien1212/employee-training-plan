import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Feedback } from '@/types/Feedback';
import { Training } from '@/types/Training';
import { SlotSignature } from '@/types/SlotSignature';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import { PublicSlotSignature } from '@/types/public/PublicSlotSignature';

interface Options {
    sessionId?: number;
    page?: number;
    size?: number;
}

const slotSignatureKey = (slotAccessToken?: string) => ['slotSignature', slotAccessToken] as const;

export function usePublicSlotSignature(slotAccessToken?: string, enabled: boolean = true) {
    return useQuery<PublicSlotSignature, Error>(
        slotSignatureKey(slotAccessToken),
        () => api.get<PublicSlotSignature>(`/v1/public/slots-signature/${slotAccessToken}`).then(res => res.data),
        {
            enabled: !!slotAccessToken && enabled,
            staleTime: 0,
        }
    );
}

export function usePublicOpenSignature() {
    const queryClient = useQueryClient();

    return useMutation(
        (slotAccessToken: string) =>
            api
                .post<SlotSignature>(`/v1/public/slots-signature/open-signature/${slotAccessToken}`)
                .then(res => res.data),
        {
            // After opening a signature, invalidate the slots list so it refetches
            onSuccess: () => {
                queryClient.invalidateQueries('slots');
            },
        }
    );
}
