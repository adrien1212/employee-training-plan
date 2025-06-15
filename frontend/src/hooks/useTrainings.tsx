import { useQuery } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Feedback } from '@/types/Feedback';
import { Training } from '@/types/Training';

interface Options {
    departmentId?: number;
    employeeId?: number;
    page?: number;
    size?: number;
}

function useTrainings({
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

export default useTrainings
