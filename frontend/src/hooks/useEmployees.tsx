// src/hooks/useEmployees.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Employee } from '@/types/Employee';
import { NewEmployee } from '@/types/NewEmployee';

export interface UseEmployeesOptions {
    departmentId?: number;
    sessionId?: number;
    page?: number;
    size?: number;
    enabled?: boolean;
}

/**
 * Build a stable key for list queries
 */
const employeesKey = ({
    departmentId,
    sessionId,
    page = 0,
    size = 10,
}: UseEmployeesOptions) =>
    ['employees', departmentId, sessionId, page, size] as const;

/**
 * Query key for single employee
 */
const employeeKey = (id?: number) => ['employee', id] as const;

/**
 * READ: list & paginate employees
 */
export function useEmployees(options: UseEmployeesOptions = {}) {
    const {
        departmentId,
        sessionId,
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = employeesKey({ departmentId, sessionId, page, size });

    return useQuery<PageResponse<Employee>, Error>(
        key,
        () =>
            api
                .get<PageResponse<Employee>>('/v1/employees', {
                    params: { departmentId, sessionId, page, size },
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
 * READ: get one employee by ID
 */
export function useEmployee(id?: number, enabled: boolean = true) {
    return useQuery<Employee, Error>(
        employeeKey(id),
        () => api.get<Employee>(`/v1/employees/${id}`).then(res => res.data),
        {
            enabled: !!id && enabled,
            staleTime: 0,
        }
    );
}

/**
 * CREATE: add a new employee
 */
export function useCreateEmployee(options: UseEmployeesOptions = {}) {
    const qc = useQueryClient();
    const key = employeesKey(options);

    return useMutation(
        (newEmp: NewEmployee) =>
            api.post<NewEmployee>('/v1/employees', newEmp).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}

/**
 * UPDATE: modify existing employee
 */
export function useUpdateEmployee(options: UseEmployeesOptions = {}) {
    const qc = useQueryClient();
    const key = employeesKey(options);

    return useMutation<
        Employee,                               // response
        Error,                                  // error
        { id: number; data: NewEmployee }      // variables
    >(
        ({ id, data }) =>
            api.put<Employee>(`/v1/employees/${id}`, data).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}

/**
 * DELETE: remove an employee
 */
export function useDeleteEmployee(options: UseEmployeesOptions = {}) {
    const qc = useQueryClient();
    const key = employeesKey(options);

    return useMutation(
        (id: number) => api.delete(`/v1/employees/${id}`),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}
