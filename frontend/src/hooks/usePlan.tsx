// src/hooks/useSessions.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Trainer } from '@/types/Trainer';
import { NewTrainer } from '@/types/NewTrainer';
import { Plan } from '@/types/Plan';

export interface PlansOptions {
    planId?: number; // quand on crée une session
    page?: number;
    size?: number;
    enabled?: boolean;
}

/**
 * Build a stable key for list queries
 */
const plansKeys = ({
    planId,
    page = 0,
    size = 10,
}: PlansOptions) =>
    ['trainer', planId, page, size] as const;

/**
 * Query key for single session
 */
const planKey = (id?: number) => ['plan', id] as const;

/**
 * READ: list & paginate sessions
 */
export function usePlans(options: PlansOptions = {}) {
    const {
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = plansKeys({ page, size });

    return useQuery<PageResponse<Plan>, Error>(
        key,
        () =>
            api
                .get<PageResponse<Plan>>('/v1/plans', {
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
export function usePlan(id?: number, enabled: boolean = true) {
    return useQuery<Plan, Error>(
        planKey(id),
        () => api.get<Plan>(`/v1/plans/${id}`).then(res => res.data),
        {
            enabled: !!id && enabled,
            staleTime: 0,
        }
    );
}

/**
 * CURRENT
 */
export function useCurrentPlan(enabled: boolean = true) {
    return useQuery<Plan, Error>(
        planKey(),
        () => api.get<Plan>(`/v1/plans/current`).then(res => res.data),
        {
            enabled: enabled,
            staleTime: 0,
        }
    );
}

export interface NewSession {
    stripeCustomerId: string;
}

export interface SessionDetail {
    client_secret: string;
}

export function useCreatePricingSession() {
    const qc = useQueryClient();
    // clé pour invalider/réordonner tes queries pricing si besoin
    const pricingKey = ['pricing', 'session'];

    return useMutation<SessionDetail, Error, NewSession>(
        (newSession) =>
            api
                .post<SessionDetail>('/v1/plans/create-pricing-session', newSession)
                .then((res) => res.data),
        {
            onSuccess: () => {
                // si tu stockes des données liées au pricing quelque part
                qc.invalidateQueries(pricingKey);
            },
        }
    );
}

interface ChangePlanResponse {
    sessionId: string;
    checkoutUrl: string;
}

export function useChangePlan() {
    const queryClient = useQueryClient();

    return useMutation<
        ChangePlanResponse,
        Error,
        { id: number }
    >(
        ({ id }) =>
            api
                .patch<ChangePlanResponse>('/v1/plans', { id })
                .then((response) => response.data),
        {
            onSuccess: () => {
                // Invalidate any stale plan queries
                queryClient.invalidateQueries(['plans']);
            },
        }
    );
}
