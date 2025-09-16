import api from '@/services/api'
import { useMutation, useQueryClient } from 'react-query'

export interface FeedbackRequestModel {
    accessToken: string
    comment: string
    rating: number
}

export const feedbacksKeys = (
    accessToken?: string,
    comment?: string,
    rating?: string,
) =>
    accessToken && comment
        ? (['accessToken', accessToken, comment] as const)
        : (['accessToken'] as const)

export function usePostFeedback() {
    const queryClient = useQueryClient()
    const key = feedbacksKeys()

    return useMutation<void, Error, FeedbackRequestModel>(
        (payload) =>
            api
                .post<void>('/v1/feedbacks', payload)
                .then(res => res.data),
        {
            onSuccess: () => {
                // if you have any queries that depend on signature state, invalidate them here
                queryClient.invalidateQueries(key)
            },
        }
    )
}