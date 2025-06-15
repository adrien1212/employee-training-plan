import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, GraduationCap, Mail, Phone, MessageSquare, Send } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import EmployeeTable from "@/components/common/EmployeesTable";
import TrainingsTable from "@/components/common/TrainingsTable";
import { Training } from "@/types/Training";
import useTrainings from "@/hooks/useTrainings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    useDepartment,
} from '@/hooks/useDepartments';

const DepartmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: department,
        isLoading: isDeptLoading,
        error: deptError,
    } = useDepartment(Number(id))

    const {
        data: trainings,
        isLoading: isTrainingLoading,
        error: trainingError,
    } = useTrainings({})

    if (isDeptLoading || isTrainingLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (deptError || trainingError) return <div className="p-4 text-center text-red-500">Erreur de chargement</div>

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
                                onClick={() => navigate('/departments')}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Retour aux départements
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
                            </div>
                        </div>
                    </header>

                    <div className="p-6 space-y-6">
                        {/* Department Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Informations du département
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Responsable</label>
                                        <p className="font-medium">{department.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Nombre d'employés</label>
                                        <p className="font-medium">{department.name}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="employees" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="employees" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Employés du département
                                </TabsTrigger>
                                <TabsTrigger value="training" className="flex items-center gap-2">
                                    <Send className="h-4 w-4" />
                                    Formations disponibles
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="employees">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Employés du département
                                        </CardTitle>
                                        <CardDescription>
                                            {department.name} employé(s) dans ce département
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <EmployeeTable departmentId={Number(id)} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="training">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5" />
                                            Formations disponibles
                                        </CardTitle>
                                        <CardDescription>
                                            {trainings.totalElements} formation(s) disponible(s) pour ce département
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <TrainingsTable items={trainings.content} page={0} totalPages={trainings.totalPages} loading={false} onPageChange={function (newPage: number): void {
                                            throw new Error("Function not implemented.");
                                        }} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div >
        </SidebarProvider >
    );
};

export default DepartmentDetail;