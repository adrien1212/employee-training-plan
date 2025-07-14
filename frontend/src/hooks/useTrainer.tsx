// src/hooks/useSessions.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Trainer } from '@/types/Trainer';
import { NewTrainer } from '@/types/NewTrainer';

export interface UseTrainersOptions {
    trainerId?: number; // quand on crée une session
    page?: number;
    size?: number;
    enabled?: boolean;
}

/**
 * Build a stable key for list queries
 */
const trainersKeys = ({
    trainerId,
    page = 0,
    size = 10,
}: UseTrainersOptions) =>
    ['trainer', trainerId, page, size] as const;

/**
 * Query key for single session
 */
const trainerKey = (id?: number) => ['trainer', id] as const;

/**
 * READ: list & paginate sessions
 */
export function useTrainers(options: UseTrainersOptions = {}) {
    const {
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = trainersKeys({ page, size });

    return useQuery<PageResponse<Trainer>, Error>(
        key,
        () =>
            api
                .get<PageResponse<Trainer>>('/v1/trainers', {
                    params: { page, size },
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
export function useTrainer(id?: number, enabled: boolean = true) {
    return useQuery<Trainer, Error>(
        trainerKey(id),
        () => api.get<Trainer>(`/v1/trainers/${id}`).then(res => res.data),
        {
            enabled: !!id && enabled,
            staleTime: 0,
        }
    );
}

/**
 * CREATE: add a new session
 */
export function useCreateTrainer(options: UseTrainersOptions = {}) {
    const qc = useQueryClient();
    const key = trainersKeys(options);

    return useMutation(
        (newSession: NewTrainer) =>
            api.post<Trainer>(`/v1/trainers`, newSession).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}

export function useUpdateTrainer(options: UseTrainersOptions = {}) {
    const qc = useQueryClient();
    const key = trainersKeys(options);
    return useMutation<
        Trainer,                               // response
        Error,                                  // error
        { id: number; data: NewTrainer }      // variables
    >(
        ({ id, data }) =>
            api.put<Trainer>(`/v1/trainers/${id}`, data).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}