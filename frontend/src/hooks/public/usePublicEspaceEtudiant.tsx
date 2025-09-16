import api from "@/services/api";
import { PublicEspaceEtudiant } from "@/types/public/PublicEspaceEtudiant";
import { useQuery } from "react-query";

/**
 * Query key for single session
 */
const espaceEtudiantKey = (accessToken?: string) => ['session', accessToken] as const;

/**
 * READ: get one session by ID
 */
export function usePublicEspaceEtudiant(accessToken?: string, enabled: boolean = true) {
    return useQuery<PublicEspaceEtudiant, Error>(
        espaceEtudiantKey(accessToken),
        () => api.get<PublicEspaceEtudiant>(`/v1/public/espace-etudiants/access?accessToken=${accessToken}`).then(res => res.data),
        {
            enabled: !!accessToken && enabled,
            staleTime: 0,
        }
    );
}