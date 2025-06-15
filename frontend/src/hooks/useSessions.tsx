// src/hooks/useSessions.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { SessionDetail } from '@/types/SessionDetail';
import { SessionStatus } from '@/types/SessionStatus';
import { NewSession } from '@/types/NewSession';

export interface UseSessionsOptions {
    trainingId?: number; // quand on crée une session
    trainerId?: number
    sessionStatus?: SessionStatus;
    page?: number;
    size?: number;
    enabled?: boolean;
}

/**
 * Build a stable key for list queries
 */
const sessionsKeys = ({
    trainingId,
    trainerId,
    sessionStatus,
    page = 0,
    size = 10,
}: UseSessionsOptions) =>
    ['sessions', trainingId, trainerId, sessionStatus, page, size] as const;

/**
 * Query key for single session
 */
const sessionKey = (id?: number) => ['session', id] as const;

/**
 * READ: list & paginate sessions
 */
export function useSessions(options: UseSessionsOptions = {}) {
    const {
        trainingId,
        trainerId,
        sessionStatus,
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = sessionsKeys({ trainingId, trainerId, sessionStatus, page, size });

    return useQuery<PageResponse<SessionDetail>, Error>(
        key,
        () =>
            api
                .get<PageResponse<SessionDetail>>('/v1/sessions', {
                    params: { trainingId, sessionStatus, page, size },
                })
                .then(res => res.data),
        {
            enabled,
            staleTime: 0,
            cacheTime: 0,
            refetchOnMount: 'always',
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );
}

/**
 * READ: get one session by ID
 */
export function useSession(id?: number, enabled: boolean = true) {
    return useQuery<SessionDetail, Error>(
        sessionKey(id),
        () => api.get<SessionDetail>(`/v1/sessions/${id}`).then(res => res.data),
        {
            enabled: !!id && enabled,
            staleTime: 0,
        }
    );
}

/**
 * CREATE: add a new session
 */
export function useCreateSession(options: UseSessionsOptions = {}) {
    const qc = useQueryClient();
    const key = sessionsKeys(options);


    return useMutation(
        (newSession: NewSession) =>
            api.post<SessionDetail>(`/v1/trainings/${options.trainingId}/session`, newSession).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}

/**
 * UPDATE: modify existing session
 */
export function useUpdateSession(options: UseSessionsOptions = {}) {
    const qc = useQueryClient();
    const key = sessionsKeys(options);

    return useMutation<
        SessionDetail,
        Error,
        { id: number; data: NewSession }
    >(
        ({ id, data }) =>
            api.put<SessionDetail>(`/v1/sessions/${id}`, data).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}

/**
 * DELETE: remove a session
 */
export function useDeleteSession(options: UseSessionsOptions = {}) {
    const qc = useQueryClient();
    const key = sessionsKeys(options);

    return useMutation(
        (id: number) => api.delete(`/v1/sessions/${id}`),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            }
        }
    );
}