import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { TrainingDocumentMetadata } from '@/types/TrainingDocumentMetadata';

/**
 * Query key generator for training documents
 */
const trainingDocumentsKey = (trainingId: number, page: number) => ['training', trainingId, 'documents', page] as const;

interface ListOptions {
    trainingId: number;
    page?: number;
    size?: number;
}

interface UploadResult {
    documentId: string;
    filename: string;
    uploadedAt: string;
}

interface UploadOptions {
    trainingId: number;
    file: File;
}

interface DeleteOptions {
    trainingId: number;
    documentId: string;
}

interface DownloadOptions {
    trainingId: number;
    documentId: string;
}

/**
 * Hook to list training documents
 */
export function useListTrainingDocuments({ trainingId, page = 0, size = 10 }: ListOptions) {
    return useQuery(
        trainingDocumentsKey(trainingId, page),
        () =>
            api
                .get<PageResponse<TrainingDocumentMetadata>>(`/v1/trainings/${trainingId}/documents`, {
                    params: { trainingId, page, size },
                })
                .then(res => res.data),
        {
            keepPreviousData: true,
        }
    );
}

/**
 * Hook to upload a PDF document to a training
 */
export function useUploadTrainingDocument() {
    const queryClient = useQueryClient();

    return useMutation<UploadResult, Error, UploadOptions>(
        ({ trainingId, file }) => {
            const formData = new FormData();
            formData.append('file', file);
            return api
                .post<UploadResult>(`/v1/trainings/${trainingId}/documents`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                .then(res => res.data);
        },
        {
            onSuccess: (_data, variables) => {
                // Invalidate list to refetch
                queryClient.invalidateQueries(trainingDocumentsKey(variables.trainingId, 0));
            },
        }
    );
}

/**
 * Hook to download a PDF document
 */
export function useDownloadTrainingDocument() {
    return useMutation<Blob, Error, DownloadOptions>(({ trainingId, documentId }) =>
        api
            .get<Blob>(`/v1/trainings/${trainingId}/documents/${documentId}/download`, {
                responseType: 'blob',
            })
            .then(res => res.data)
    );
}

/**
 * Hook to delete a training document
 */
export function useDeleteTrainingDocument() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, DeleteOptions>(
        ({ trainingId, documentId }) =>
            api.delete(`/v1/trainings/${trainingId}/documents/${documentId}`),
        {
            onSuccess: (_data, variables) => {
                // Invalidate first page list
                queryClient.invalidateQueries(trainingDocumentsKey(variables.trainingId, 0));
            },
        }
    );
}
