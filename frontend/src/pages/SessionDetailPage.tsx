import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Clock, MapPin, Users, MessageSquare, Send } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { SessionDetail } from "@/types/SessionDetail";
import { SessionStatus } from "@/types/SessionStatus";
import api from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackTabs from "@/components/common/FeedbackTabs";
import FeedbackPending from "@/components/common/FeedbackPending";
import SessionEnrollmentCard from "@/components/common/SessionEnrollmentTable";
import { useSession } from "@/hooks/useSessions";
import SignatureMatrix from "@/components/common/SignatureMatrix";
import SlotSignatureTable from "@/components/common/SlotSignatureTable";
import { useTrainer } from "@/hooks/useTrainer";


const getStatusColor = (status: SessionDetail['status']) => {
    const colors: Record<SessionDetail['status'], string> = {
        NOT_STARTED: 'bg-blue-100 text-blue-800',
        ACTIVE: 'bg-green-100 text-green-800',
        COMPLETED: 'bg-gray-100 text-gray-800',
        CANCELLED: 'bg-red-100 text-red-800',
        DRAFT: 'bg-red-100 text-red-800'
    };
    return colors[status];
};

const getStatusLabel = (status: SessionDetail['status']) => {
    const labels: Record<SessionDetail['status'], string> = {
        NOT_STARTED: 'Programmée',
        ACTIVE: 'En cours',
        COMPLETED: 'Terminée',
        CANCELLED: 'Annulée',
        DRAFT: "Draft"
    };
    return labels[status];
};

const SessionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: session,
        isLoading,
        isError,
        error
    } = useSession(Number(id))

    const {
        data: trainer,
        isLoading: isTrainerLoading,
        isError: isTrainerError
    } = useTrainer(Number(session?.trainerId),

        // only run once session.trainerId is truthy
        Boolean(session?.trainerId)
    )

    console.log(session?.trainerId)

    if (isLoading || isTrainerLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (isError || isTrainerError) return <div className="p-4 text-center text-red-500">Erreur de chargement</div>

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
                                onClick={() => navigate('/sessions')}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Retour aux sessions
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{session.training.title}</h1>
                                <p className="text-gray-600">Session du {session.startDate} à {session.endDate}</p>
                            </div>
                        </div>
                    </header>

                    <div className="p-6 space-y-6">
                        {/* Informations de la session */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Informations de la session
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <label className="text-sm text-gray-600">Date</label>
                                            <p className="font-medium">{session.startDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <label className="text-sm text-gray-600">Heure</label>
                                            <p className="font-medium">{session.startDate} ({session.endDate})</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <label className="text-sm text-gray-600">Lieu</label>
                                            <p className="font-medium">{session.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <label className="text-sm text-gray-600">Formateur</label>
                                            <p className="font-medium">{trainer.firstName} {trainer.lastName}</p>
                                            <p>URL public : /public/signature/{session.trainerAccessToken} </p>
                                        </div>

                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <div>
                                            <label className="text-sm text-gray-600">Status</label>
                                        </div>
                                        <div className="mt-1">
                                            <ul className="list-disc list-inside">
                                                {session.sessionStatusHistory.map((h) => (
                                                    <li key={h.id}>
                                                        <Badge className={getStatusColor(session.status)}>
                                                            {getStatusLabel(session.status)}
                                                        </Badge> - {new Date(h.changedAt).toLocaleDateString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Liste des participants */}
                        <SessionEnrollmentCard sessionId={Number(id)} />

                        {/* Signatures */}
                        {(session.status === SessionStatus.Active || session.status === SessionStatus.Completed) && (
                            <Tabs defaultValue="matrix" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="matrix" className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Matrice des signatures
                                    </TabsTrigger>
                                    <TabsTrigger value="slot-signature" className="flex items-center gap-2">
                                        <Send className="h-4 w-4" />
                                        Créneaux à signer
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="matrix">
                                    <SignatureMatrix sessionId={Number(id)} />
                                </TabsContent>

                                <TabsContent value="slot-signature">
                                    <SlotSignatureTable sessionId={Number(id)} />
                                </TabsContent>
                            </Tabs>
                        )}


                        {/* Avis (si session terminée) */}
                        {session.status === SessionStatus.Completed && (
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
                                    <FeedbackTabs sessionId={Number(id)} pageSize={20} />
                                </TabsContent>

                                <TabsContent value="pending">
                                    <FeedbackPending sessionId={Number(id)} pageSize={20} />
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default SessionDetailPage;
