import { useQuery } from 'react-query';
import api from '@/services/api';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import { PageResponse } from '@/types/PageResponse';
import { SessionStatus } from '@/types/SessionStatus';

interface UseSessionEnrollmentsOptions {
    trainingId?: number;
    sessionId?: number;
    employeeId?: number;
    status?: SessionStatus;
    isFeedbackGiven?: boolean;
    page?: number;
    size?: number;
    enabled?: boolean
}

const sessionEnrollmentsKeys = ({
    trainingId,
    sessionId,
    employeeId,
    status,
    isFeedbackGiven,
    page = 0,
    size = 10,
}: UseSessionEnrollmentsOptions) =>
    ['sessionEnrollments', trainingId, sessionId, employeeId, status, isFeedbackGiven, page, size] as const

export function useSessionsEnrollment(options: UseSessionEnrollmentsOptions = {}) {
    const {
        trainingId,
        sessionId,
        employeeId,
        status,
        isFeedbackGiven,
        page = 0,
        size = 10,
        enabled = true
    } = options
    const key = sessionEnrollmentsKeys({ trainingId, sessionId, employeeId, status, isFeedbackGiven, page, size })


    return useQuery<PageResponse<SessionEnrollment>, Error>(
        key,
        () =>
            api.get<PageResponse<SessionEnrollment>>('/v1/sessions-enrollment', {
                params: {
                    trainingId,
                    sessionId,
                    employeeId,
                    sessionStatus: status,
                    isFeedbackGiven,
                    page,
                    size,
                },
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
    )
}