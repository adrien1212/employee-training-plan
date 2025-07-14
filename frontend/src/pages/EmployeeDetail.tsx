import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, User, Calendar, Mail, Phone, Building } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Employee } from "@/types/Employee";
import api from "@/services/api";
import { SessionEnrollment } from "@/types/SessionEnrollment";
import { PageResponse } from "@/types/PageResponse";
import { SessionStatus } from "@/types/SessionStatus";
import EmployeeSessionsEnrollmentHistory from "@/components/common/EmployeeSessionsEnrollmentHistory";
import { useEmployee } from "@/hooks/useEmployees";
import { useSessionsEnrollment } from "@/hooks/useSessionEnrollments";
import SessionsTabs from "@/components/common/SessionsTabs";

const EmployeeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: sessionsEnrollment,
        isLoading: isSessionEnrollmentLoading,
        error: sessionEnrollmentError,
    } = useSessionsEnrollment({ employeeId: Number(id) })

    const {
        data: employee,
        isLoading,
        isError,
        error,
    } = useEmployee(Number(id));



    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    if (!employee) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Chargement…
            </div>
        );
    }

    if (isLoading) return <p>Loading employee…</p>;
    if (isError) return <p>Error loading: {error.message}</p>;
    if (!employee) return <p>No employee found with ID {id}.</p>;

    if (isSessionEnrollmentLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (sessionEnrollmentError) return <div className="p-4 text-center text-red-500">Erreur de chargement</div>

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <main className="flex-1">
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/employees')}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Retour aux employés
                            </Button>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                        {getInitials(employee.firstName, employee.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {employee.firstName} {employee.lastName}
                                    </h1>
                                    <p className="text-gray-600">{employee.department.name}</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="p-6 space-y-6">
                        {/* Informations personnelles */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informations personnelles
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <label className="text-sm text-gray-600">Nom Prénom</label>
                                            <p className="font-medium">{employee.codeEmployee} - {employee.firstName} {employee.lastName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <label className="text-sm text-gray-600">Email</label>
                                            <p className="font-medium">{employee.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <label className="text-sm text-gray-600">Département</label>
                                            <p className="font-medium">{employee.department.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Historique des sessions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Historique des formations
                                </CardTitle>
                                <CardDescription>
                                    Sessions auxquelles {employee.firstName + " " + employee.lastName} a participé ou va participer
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EmployeeSessionsEnrollmentHistory items={sessionsEnrollment.content} page={0} totalPages={0} loading={false} onPageChange={function (newPage: number): void {
                                    throw new Error("Function not implemented.");
                                }} />
                            </CardContent>
                        </Card>


                        {/* Statistiques */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {sessionsEnrollment.totalElements}
                                        </div>
                                        <div className="text-sm text-gray-600">Total formations</div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {sessionsEnrollment.content.filter(sE => sE.session.status === SessionStatus.Completed).length}
                                        </div>
                                        <div className="text-sm text-gray-600">Formations terminées</div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {sessionsEnrollment.content.filter(s => s.feedback).length > 0
                                                ? (sessionsEnrollment.content
                                                    .filter(s => s.feedback)
                                                    .reduce((acc, s) => acc + (s.feedback?.rating || 0), 0) /
                                                    sessionsEnrollment.content.filter(s => s.feedback).length).toFixed(1)
                                                : '-'
                                            }
                                        </div>
                                        <div className="text-sm text-gray-600">Note moyenne</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default EmployeeDetail;