import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { NotificationParameter } from '@/types/NotificationParameter';

export interface UseNotificationParametersOptions {
    page?: number;
    size?: number;
    enabled?: boolean;
}

/**
 * Build a stable key for list queries
 */
const notificationParametersKeys = ({ page = 0, size = 10 }: UseNotificationParametersOptions) =>
    ['notificationParameters', page, size] as const;

/**
 * READ: list & paginate notification parameters
 */
export function useNotificationParameters(options: UseNotificationParametersOptions = {}) {
    const { page = 0, size = 10, enabled = true } = options;
    const key = notificationParametersKeys({ page, size });

    return useQuery<PageResponse<NotificationParameter>, Error>(
        key,
        () =>
            api
                .get<PageResponse<NotificationParameter>>('/v1/notifications/parameters', {
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
 * MUTATIONS: enable / disable notification parameter
 */
export function useEnableNotificationParameter(options: UseNotificationParametersOptions = {}) {
    const qc = useQueryClient();
    const key = notificationParametersKeys(options);

    return useMutation<void, Error, number>(
        id => api.put<void>(`/v1/notifications/parameters/${id}/enable`).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}

export function useDisableNotificationParameter(options: UseNotificationParametersOptions = {}) {
    const qc = useQueryClient();
    const key = notificationParametersKeys(options);

    return useMutation<void, Error, number>(
        id => api.delete<void>(`/v1/notifications/parameters/${id}/enable`).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}
