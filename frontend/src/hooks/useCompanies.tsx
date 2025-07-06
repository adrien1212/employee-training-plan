// src/hooks/useSessions.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Trainer } from '@/types/Trainer';
import { NewTrainer } from '@/types/NewTrainer';
import { Plan } from '@/types/Plan';
import { Company } from '@/types/Company';



/**
 * Query key for single session
 */
const companyKey = (id?: number) => ['company', id] as const;

/**
 * CURRENT
 */
export function useCurrentCompany(enabled: boolean = true) {
    return useQuery<Company, Error>(
        companyKey(),
        () => api.get<Company>(`/v1/companies`).then(res => res.data),
        {
            enabled: enabled,
            staleTime: 0,
        }
    );
}