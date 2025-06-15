import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Plus, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useEmployees } from "@/hooks/useEmployees";
import { useDepartments } from "@/hooks/useDepartments";
import { useSessions } from "@/hooks/useSessions";
import { Employee } from "@/types/Employee";
import { SessionEnrollment } from "@/types/SessionEnrollment";
import api from "@/services/api";
import { SessionStatus } from "@/types/SessionStatus";
import { useSessionsEnrollment } from "@/hooks/useSessionEnrollments";

export default function AddEmployeeToSession() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [departmentFilter, setDepartmentFilter] = useState<number | null>(null);
    const [selectedSession, setSelectedSession] = useState<number | null>(null);
    const [sessionParticipants, setSessionParticipants] = useState<SessionEnrollment[]>([]);

    // Fetch all data
    const {
        data: employeesData,
        isLoading: isEmployeesLoading,
        isError: isEmployeesError,
    } = useEmployees({});

    const {
        data: sessionsData,
        isLoading: isSessionsLoading,
        isError: isSessionsError,
    } = useSessions({ sessionStatus: SessionStatus.NotStarted });

    const {
        data: departmentsData,
        isLoading: isDepartmentsLoading,
        isError: isDepartmentsError,
    } = useDepartments({ page: 0, size: 10000 });

    const {
        data: enrollmentsData,
        isLoading: isEnrollmentsLoading,
        error: isEnrollmentsError,
        refetch: refetchEnrollments,
    } = useSessionsEnrollment({ sessionId: selectedSession });

    // When session changes, update participants
    useEffect(() => {
        if (enrollmentsData?.content) {
            setSessionParticipants(enrollmentsData.content);
        } else {
            setSessionParticipants([]);
        }
    }, [enrollmentsData]);

    // Derived state: filtered employees
    const filteredEmployees: Employee[] =
        employeesData?.content.filter((emp) => {
            const matchesSearch =
                emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = !departmentFilter || emp.department.id === departmentFilter;
            return matchesSearch && matchesDept;
        }) || [];

    const addEmployeeToSession = async (employee: Employee) => {
        if (!selectedSession) {
            toast({ title: "Erreur", description: "Veuillez sélectionner une session.", variant: "destructive" });
            return;
        }

        const already = sessionParticipants.some(
            (sp) => sp.employee.id === employee.id
        );
        if (already) {
            toast({ title: "Erreur", description: "Cet employé est déjà inscrit.", variant: "destructive" });
            return;
        }

        try {
            // call API endpoint to subscribe
            await api.post(`/v1/sessions/${selectedSession}/subscribe/${employee.id}`);
            toast({ title: "Succès", description: "Employé ajouté!" });
            await refetchEnrollments();
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de l'ajout.", variant: "destructive" });
        }
    };

    const removeEmployeeFromSession = async (enrollment: SessionEnrollment) => {
        try {
            // call API to unsubscribe
            await api.delete(`/v1/sessions/${enrollment.session.id}/subscribe/${enrollment.employee.id}`);
            toast({ title: "Succès", description: "Employé retiré." });
            await refetchEnrollments();
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de la suppression.", variant: "destructive" });
        }
    };

    const getInitials = (first: string, last: string) =>
        `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

    if (isEmployeesLoading || isSessionsLoading || isDepartmentsLoading)
        return <div className="p-4 text-center text-gray-500">Chargement…</div>;
    if (isEmployeesError || isSessionsError || isDepartmentsError)
        return <div className="p-4 text-center text-red-500">Erreur de chargement</div>;

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <main className="flex-1">
                    <header className="bg-white border-b px-6 py-4">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div>
                                <h1 className="text-2xl font-bold">Gestion des Participants</h1>
                                <p className="text-gray-600">Ajoutez ou retirez des employés</p>
                            </div>
                        </div>
                    </header>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sessions list */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" /> Sessions disponibles
                                </CardTitle>
                                <CardDescription>Sélectionnez une session</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {sessionsData.content.map((s) => (
                                        <div
                                            key={s.id}
                                            className={`p-3 rounded-lg border cursor-pointer ${selectedSession === s.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                            onClick={() => setSelectedSession(s.id)}
                                        >
                                            <div className="font-medium">{s.training.title}</div>
                                            <div className="text-sm text-gray-600">{s.startDate} à {s.endDate}</div>
                                            <Badge variant="secondary" className="mt-1">
                                                10/10
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Employees list */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" /> Employés disponibles
                                </CardTitle>
                                <CardDescription>Recherchez et ajoutez</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Rechercher..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        {/* 
                                        <Select
                                            value={departmentFilter}
                                            onValueChange={(val) => setDepartmentFilter(val ? Number(val) : null)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Filtrer par département" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Tous</SelectItem>
                                                {departmentsData.content.map((d) => (
                                                    <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        */}
                                    </div>

                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {filteredEmployees.map((emp) => (
                                            <div key={emp.id} className="flex items-center justify-between p-2 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                                            {getInitials(emp.firstName, emp.lastName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-sm">
                                                            {emp.firstName} {emp.lastName}
                                                        </div>
                                                        <div className="text-xs text-gray-600">{emp.department.name}</div>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => addEmployeeToSession(emp)} disabled={!selectedSession}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Participants */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" /> Participants inscrits
                                </CardTitle>
                                <CardDescription>
                                    {selectedSession
                                        ? `Session: ${sessionsData.content.find((s) => s.id === selectedSession)?.training.title}`
                                        : "Sélectionnez une session"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedSession ? (
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {sessionParticipants.map((se) => (
                                            <div key={se.id} className="flex items-center justify-between p-2 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                                                            {getInitials(se.employee.firstName, se.employee.lastName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-sm">
                                                            {se.employee.firstName} {se.employee.lastName}
                                                        </div>
                                                        <div className="text-xs text-gray-600">{se.employee.department.name}</div>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => removeEmployeeFromSession(se)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                        {sessionParticipants.length === 0 && <p className="text-center text-gray-500 py-4">Aucun participant inscrit</p>}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">Sélectionnez une session pour voir les participants</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}

