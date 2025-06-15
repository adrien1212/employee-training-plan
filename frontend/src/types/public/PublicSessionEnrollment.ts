export interface PublicSessionEnrollment {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    hasSigned: boolean;
    sessionEnrollmentToken: string;
}