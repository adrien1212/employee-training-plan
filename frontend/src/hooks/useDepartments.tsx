// hooks/departments.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Department } from '@/types/Department';

export interface UseDepartmentOptions {
    trainingId?: number,
    page?: number;
    size?: number;
    enabled?: boolean;
}

// ——————————————————————————
// Query Keys
// ——————————————————————————
/**
 * Query key for single employee
 */
const departmentKey = (id?: number) => ['department', id] as const;


const departmentsKey = ({
    trainingId,
    page = 0,
    size = 10,
}: UseDepartmentOptions) =>
    ['departments', trainingId, page, size] as const;

export function useDepartments(options: UseDepartmentOptions = {}) {
    const {
        trainingId,
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = departmentsKey({ trainingId, page, size });
    return useQuery<PageResponse<Department>, Error>(
        key,
        () => api.get<PageResponse<Department>>('/v1/departments', {
            params: { trainingId, page, size },
        }).then(r => r.data),
        { keepPreviousData: true }
    );
}

export function useDepartment(id?: number) {
    return useQuery<Department, Error>(
        departmentKey(id!),
        () => api.get<Department>(`/v1/departments/${id}`).then(r => r.data),
        { enabled: !!id }
    );
}

/**
 * COUNT
 */
export function useCountDepartments(enabled: boolean = true) {
    return useQuery<number, Error>(
        departmentKey(),
        () => api.get<number>(`/v1/departments/count`).then(res => res.data),
        {
            enabled: enabled,
            staleTime: 0,
        }
    );
}