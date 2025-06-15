import api from '@/services/api'
import { useMutation, useQueryClient } from 'react-query'

export interface SignatureRequestModel {
    slotToken: string
    sessionEnrollmentToken: string
    signature: string
}

export const signaturesKeys = (
    slotToken?: string,
    sessionEnrollmentToken?: string
) =>
    slotToken && sessionEnrollmentToken
        ? (['signatures', slotToken, sessionEnrollmentToken] as const)
        : (['signatures'] as const)

export function usePostSignature() {
    const queryClient = useQueryClient()
    const key = signaturesKeys()

    return useMutation<void, Error, SignatureRequestModel>(
        (payload) =>
            api
                .post<void>('/v1/public/signatures', payload)
                .then(res => res.data),
        {
            onSuccess: () => {
                // if you have any queries that depend on signature state, invalidate them here
                queryClient.invalidateQueries(key)
            },
        }
    )
}