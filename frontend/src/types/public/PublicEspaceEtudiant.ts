import { Employee } from "../Employee";
import { PublicEmployee } from "./PublicEmployee";
import { PublicSessionEnrollment } from "./PublicSessionEnrollment";

export interface PublicEspaceEtudiant {
    employee: PublicEmployee,
    sessionsEnrollment: PublicSessionEnrollment[]
}