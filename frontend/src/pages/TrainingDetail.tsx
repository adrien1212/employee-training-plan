import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Users, Calendar, Clock, FileText, MessageSquare, Send, Save, Download, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SessionsTabs from "@/components/common/SessionsTabs";
import TrainingSessionEnrollmentTabs from "@/components/common/TrainingSessionEnrollmentTabs";
import FeedbackTabs from "@/components/common/FeedbackTabs";
import FeedbackPending from "@/components/common/FeedbackPending";
import TrainingsDetailBody from "@/components/common/TrainingsDetailBody";
import { useTraining } from "@/hooks/useTrainings";
import { useCountEmployees } from "@/hooks/useEmployees";


const TrainingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: training,
        isLoading: isTrainingLoading,
        isError: isTrainingError
    } = useTraining(Number(id))

    const {
        data: countEmployee,
        isLoading: countEmployeeLoading,
        isError: countEmployeeError,
    } = useCountEmployees({ trainingId: Number(id) })

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'default',
            completed: 'secondary',
            not_started: 'outline',
            current: 'default',
            scheduled: 'outline'
        } as const;

        const labels = {
            active: 'Active',
            completed: 'Terminée',
            not_started: 'Non commencée',
            current: 'En cours',
            scheduled: 'Programmé'
        };

        return (
            <Badge variant={variants[status as keyof typeof variants]}>
                {labels[status as keyof typeof labels]}
            </Badge>
        );
    };

    if (isTrainingLoading || countEmployeeLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Chargement…
            </div>
        );
    }

    if (isTrainingError || countEmployeeError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Erreur…
            </div>
        );
    }

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
                                onClick={() => navigate('/trainings')}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Retour aux formations
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{training.title}</h1>
                                <p className="text-gray-600">{training.description}</p>
                            </div>
                        </div>
                    </header>

                    <div className="p-6 space-y-6">
                        {/* Training Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Informations de la formation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        {training.departments.map((dept) => (
                                            <div key={dept.id}>
                                                <Label>Département</Label>
                                                <Badge key={dept.id} variant="outline">
                                                    {dept.name}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Durée</Label>
                                        <p className="font-medium">{training.duration} heures</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Employés formés</Label>
                                        <p className="font-medium">{countEmployee}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>


                        {/* Tabs */}
                        <Tabs defaultValue="sessions" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                                <TabsTrigger value="participants">Participants</TabsTrigger>
                                <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
                            </TabsList>

                            {/* Tabs */}
                            <TabsContent value="sessions">
                                <SessionsTabs
                                    trainingId={id!}
                                    getStatusBadge={getStatusBadge}
                                />
                            </TabsContent>

                            <TabsContent value="participants" className="space-y-4">
                                <TrainingSessionEnrollmentTabs
                                    trainingId={Number(id!)}
                                />
                            </TabsContent>

                            <TabsContent value="feedbacks" className="space-y-4">
                                <Tabs defaultValue="received" className="space-y-4">
                                    <TabsList>
                                        <TabsTrigger value="received" className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            Avis reçus
                                        </TabsTrigger>
                                        <TabsTrigger value="pending" className="flex items-center gap-2">
                                            <Send className="h-4 w-4" />
                                            Avis en attente
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="received">
                                        <FeedbackTabs trainingId={Number(id)} pageSize={20} />
                                    </TabsContent>

                                    <TabsContent value="pending">
                                        <FeedbackPending pageSize={20} />
                                    </TabsContent>
                                </Tabs>
                            </TabsContent>
                        </Tabs>


                        {/* Content Management */}
                        <TrainingsDetailBody />

                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default TrainingDetail;