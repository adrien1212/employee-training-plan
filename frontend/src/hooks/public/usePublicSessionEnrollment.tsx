import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PublicSession } from '@/types/public/PublicSession';
import { PublicSessionEnrollment } from '@/types/public/PublicSessionEnrollment';


/**
 * Query key for single session
 */
const sessionEnrollmentKey = (accessToken?: string) => ['session', accessToken] as const;

/**
 * READ: get one session by ID
 */
export function usePublicSessionEnrollement(accessToken?: string, enabled: boolean = true) {
    return useQuery<PublicSessionEnrollment, Error>(
        sessionEnrollmentKey(accessToken),
        () => api.get<PublicSessionEnrollment>(`/v1/public/sessions-enrollment/${accessToken}`).then(res => res.data),
        {
            enabled: !!accessToken && enabled,
            staleTime: 0,
        }
    );
}