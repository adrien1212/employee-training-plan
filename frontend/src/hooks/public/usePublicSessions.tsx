// src/hooks/useSessions.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { SessionDetail } from '@/types/SessionDetail';
import { SessionStatus } from '@/types/SessionStatus';
import { NewSession } from '@/types/NewSession';
import { PublicSession } from '@/types/public/PublicSession';
import { PublicSessionEnrollment } from '@/types/public/PublicSessionEnrollment';
import { PublicSlotSignature } from '@/types/public/PublicSlotSignature';


/**
 * Query keys
 */
const sessionKey = (token?: string) => ['publicSession', token] as const;
const enrollmentKey = (token?: string) => ['publicSessionEnrollment', token] as const;
const slotSignatureKey = (token?: string) => ['publicSlotSignature', token] as const;

/**
 * READ: get one session by ID
 */
export function useTrainerPublicSession(
    trainerAccessToken?: string,
    enabled: boolean = true
) {
    return useQuery<PublicSession, Error>(
        sessionKey(trainerAccessToken),
        () =>
            api
                .get<PublicSession>(`/v1/public/sessions/${trainerAccessToken}`)
                .then(res => res.data),
        {
            enabled: !!trainerAccessToken && enabled,
            staleTime: 0,
        }
    );
}

/**
 * READ: get session enrollments
 */
export function useTrainerPublicSessionEnrollment(
    trainerAccessToken?: string,
    enabled: boolean = true
) {
    return useQuery<PageResponse<PublicSessionEnrollment>, Error>(
        enrollmentKey(trainerAccessToken),
        () =>
            api
                .get<PageResponse<PublicSessionEnrollment>>(
                    `/v1/public/sessions/${trainerAccessToken}/sessions-enrollment`
                )
                .then(res => res.data),
        {
            enabled: !!trainerAccessToken && enabled,
            staleTime: 0,
        }
    );
}

/**
 * READ: get session enrollments
 */
export function useTrainerPublicSlotSignature(
    trainerAccessToken?: string,
    enabled: boolean = true
) {
    return useQuery<PageResponse<PublicSlotSignature>, Error>(
        slotSignatureKey(trainerAccessToken),
        () =>
            api
                .get<PageResponse<PublicSlotSignature>>(
                    `/v1/public/sessions/${trainerAccessToken}/slots-signature`
                )
                .then(res => res.data),
        {
            enabled: !!trainerAccessToken && enabled,
            staleTime: 0,
        }
    );
}