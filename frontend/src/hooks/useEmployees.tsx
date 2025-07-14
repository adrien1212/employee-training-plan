// src/hooks/useEmployees.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Employee } from '@/types/Employee';
import { NewEmployee } from '@/types/NewEmployee';

export interface UseEmployeesOptions {
    departmentId?: number;
    trainingId?: number;
    sessionId?: number;
    firstName?: string,
    lastName?: string,
    email?: string,
    page?: number;
    size?: number;
    enabled?: boolean;
}

/**
 * Build a stable key for list queries
 */
const employeesKey = ({
    departmentId,
    trainingId,
    sessionId,
    firstName,
    lastName,
    email,
    page = 0,
    size = 10,
}: UseEmployeesOptions) =>
    ['employees', departmentId, trainingId, sessionId, firstName, lastName, email, page, size] as const;


export const employeesCountKey = (params: { departmentId?: number; trainingId?: number; page: number; size: number }) =>
    ['employees', 'count', params] as const

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
        firstName,
        lastName,
        email,
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = employeesKey({ departmentId, sessionId, firstName, lastName, email, page, size });

    return useQuery<PageResponse<Employee>, Error>(
        key,
        () =>
            api
                .get<PageResponse<Employee>>('/v1/employees', {
                    params: { departmentId, sessionId, firstName, lastName, email, page, size },
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
 * SEARCH: list & paginate employees
 */
export function useEmployeesSearch(options: UseEmployeesOptions = {}) {
    const {
        departmentId,
        sessionId,
        firstName,
        lastName,
        email,
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = employeesKey({ departmentId, sessionId, firstName, lastName, email, page, size });

    return useQuery<PageResponse<Employee>, Error>(
        key,
        () =>
            api
                .get<PageResponse<Employee>>('/v1/employees/search-or', {
                    params: { departmentId, sessionId, firstName, lastName, email, page, size },
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

export function useCountEmployees(options: UseEmployeesOptions = {}) {
    const {
        departmentId,
        trainingId,
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = employeesCountKey({ departmentId, trainingId, page, size });

    return useQuery<number, Error>(
        key,
        () =>
            api
                .get<number>('/v1/employees/count', {
                    params: { departmentId, trainingId, page, size },
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
