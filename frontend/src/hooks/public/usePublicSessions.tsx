// src/hooks/useSessions.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { SessionDetail } from '@/types/SessionDetail';
import { SessionStatus } from '@/types/SessionStatus';
import { NewSession } from '@/types/NewSession';
import { PublicSession } from '@/types/public/PublicSession';


/**
 * Query key for single session
 */
const sessionKey = (trainerAccessToken?: string) => ['session', trainerAccessToken] as const;

/**
 * READ: get one session by ID
 */
export function usePublicSession(trainerAccessToken?: string, enabled: boolean = true) {
    return useQuery<PublicSession, Error>(
        sessionKey(trainerAccessToken),
        () => api.get<PublicSession>(`/v1/public/sessions/${trainerAccessToken}`).then(res => res.data),
        {
            enabled: !!trainerAccessToken && enabled,
            staleTime: 0,
        }
    );
}