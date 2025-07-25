import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Feedback } from '@/types/Feedback';

interface Options {
    trainingId?: number;
    sessionId?: number;
    page?: number;
    size?: number;
    enabled?: boolean;
}

/**
 * Build a stable key for list queries
 */
const sessionsKeys = ({
    trainingId,
    sessionId,
    page = 0,
    size = 10,
}: Options) =>
    ['sessions', trainingId, sessionId, page, size] as const;

export function useFeedback(options: Options) {
    const {
        trainingId,
        sessionId,
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = sessionsKeys({ trainingId, sessionId, page });
    const queryFn = () =>
        api
            .get<PageResponse<Feedback>>('/v1/feedbacks', {
                params: {
                    trainingId,
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


/**
 * OPEN
 */
export function useFeebackRelance() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            api.post<Feedback>(`/v1/feedbacks/${id}/relance`).then(res => res.data),
        onSuccess: (_data, id) => {
            qc.invalidateQueries(['feedback', id]);
        },
    });
}