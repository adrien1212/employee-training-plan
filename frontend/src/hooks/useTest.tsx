import api from "@/services/api";
import { useMutation } from "react-query";

export interface NewTestEmail {
    toEmail: string
}

export function useCreateEmailTest() {
    return useMutation({
        mutationFn: (newTestEmail: NewTestEmail) =>
            api.post<string>(`/v1/test/send-email`, newTestEmail).then(res => res.data),
        onSuccess: () => {
            // handle success
        },
    })
}
