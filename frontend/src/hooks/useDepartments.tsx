// hooks/departments.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Department } from '@/types/Department';

export interface UseDepartmentOptions {
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
    page = 0,
    size = 10,
}: UseDepartmentOptions) =>
    ['departments', page, size] as const;

export function useDepartments(options: UseDepartmentOptions = {}) {
    const {
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = departmentsKey({ page, size });
    return useQuery<PageResponse<Department>, Error>(
        key,
        () => api.get<PageResponse<Department>>('/v1/departments').then(r => r.data),
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