import { useQuery } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Training } from '@/types/Training';

interface Options {
    departmentId?: number;
    employeeId?: number;
    page?: number;
    size?: number;
}

const trainingKey = (id?: number) => ['training', id] as const;

/**
 * GET
 */
export function useTrainings({
    departmentId,
    employeeId,
    page = 0,
    size = 10,
}: Options) {
    const key = ['trainings', departmentId, employeeId, page];
    const queryFn = () =>
        api
            .get<PageResponse<Training>>('/v1/trainings', {
                params: {
                    departmentId,
                    employeeId,
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

export function useTraining(id?: number, enabled: boolean = true) {
    return useQuery<Training, Error>(
        trainingKey(id),
        () => api.get<Training>(`/v1/trainings/${id}`).then(res => res.data),
        {
            enabled: !!id && enabled,
            staleTime: 0,
        }
    );
}

/**
 * COUNT
 */
export function useCountTrainings(enabled: boolean = true) {
    return useQuery<number, Error>(
        trainingKey(),
        () => api.get<number>(`/v1/trainings/count`).then(res => res.data),
        {
            enabled: enabled,
            staleTime: 0,
        }
    );
}