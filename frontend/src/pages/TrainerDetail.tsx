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
import { useTrainer } from "@/hooks/useTrainer";
import { useSessions } from "@/hooks/useSessions";
import TrainerSessionsHistory from "@/components/common/TrainerSessionsHistory";

const TrainerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: sessions,
        isLoading: isSessionLoading,
        error: sessionError,
    } = useSessions({ trainerId: Number(id) })

    const {
        data: trainer,
        isLoading,
        isError,
        error,
    } = useTrainer(Number(id));



    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    if (!trainer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Chargement…
            </div>
        );
    }

    if (isLoading) return <p>Loading trainer</p>;
    if (isError) return <p>Error loading: {error.message}</p>;
    if (!trainer) return <p>No Trainer found with ID {id}.</p>;

    if (isSessionLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (sessionError) return <div className="p-4 text-center text-red-500">Erreur de chargement</div>

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
                                Retour aux formateurs
                            </Button>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                        {getInitials(trainer.firstName, trainer.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {trainer.firstName} {trainer.lastName}
                                    </h1>
                                    <p className="text-gray-600">{trainer.speciality}</p>
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
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <label className="text-sm text-gray-600">Email</label>
                                            <p className="font-medium">{trainer.email}</p>
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
                                    Sessions auxquelles {trainer.firstName + " " + trainer.lastName} a participé ou va participer
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TrainerSessionsHistory items={sessions.content} page={0} totalPages={0} loading={false} onPageChange={function (newPage: number): void {
                                    throw new Error("Function not implemented.");
                                }} />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default TrainerDetail;