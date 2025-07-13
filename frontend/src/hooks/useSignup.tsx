// src/hooks/useSessions.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { SessionDetail } from '@/types/SessionDetail';
import { Trainer } from '@/types/Trainer';
import { NewTrainer } from '@/types/NewTrainer';
import { SignupFormData } from '@/types/public/SignupFormData';


export interface UseSignupOption {
    page?: number;
    size?: number;
    enabled?: boolean;
}

/**
 * Build a stable key for list queries
 */
const trainersKeys = ({
    page = 0,
    size = 10,
}: UseSignupOption) =>
    ['singup', page, size] as const;

/**
 * CREATE: add a new session
 */
export function useSignUp(options: UseSignupOption = {}) {
    const qc = useQueryClient();
    const key = trainersKeys(options);

    return useMutation(
        (signupFormData: SignupFormData) =>
            api.post(`/v1/signup`, signupFormData).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}