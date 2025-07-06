import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Upload, Users, Calendar, Clock, FileText, MessageSquare, Send, Save, Download, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { SessionDetail } from "@/types/SessionDetail";
import { Training } from "@/types/Training";
import { SessionStatus } from "@/types/SessionStatus";
import api from "@/services/api";
import { PageResponse } from "@/types/PageResponse";
import SessionsTabs from "@/components/common/SessionsTabs";
import TrainingSessionEnrollmentTabs from "@/components/common/TrainingSessionEnrollmentTabs";
import FeedbackTabs from "@/components/common/FeedbackTabs";
import FeedbackPending from "@/components/common/FeedbackPending";
import { Textarea } from "@/components/ui/textarea";
import TrainingsDetailBody from "@/components/common/TrainingsDetailBody";


interface Attachment {
    id: number;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
}

const TrainingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [content, setContent] = useState("");
    const [attachments, setAttachments] = useState<Attachment[]>([
        { id: 1, name: "support-cours.pdf", type: "PDF", size: "2.5 MB", uploadDate: "2024-06-08" },
        { id: 2, name: "exercices.docx", type: "Word", size: "1.2 MB", uploadDate: "2024-06-08" },
    ]);

    const [training, setTraining] = useState<Training>();

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                const res = await api.get(`v1/trainings/${id}`);
                setTraining(res.data);
            } catch (err) {
                console.error(err);
                toast({
                    title: "Erreur de chargement",
                    description: "Impossible de récupérer la formation.",
                    variant: "destructive",
                });
            }
        };
        if (id) fetchTraining();
    }, [id, toast]);


    const handleSaveContent = () => {
        // Ici vous sauvegarderez le contenu via votre API
        console.log("Contenu sauvegardé:", content);
        toast({
            title: "Contenu sauvegardé",
            description: "Les informations de la formation ont été mises à jour.",
        });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const newAttachment: Attachment = {
                    id: Math.max(...attachments.map(a => a.id)) + 1,
                    name: file.name,
                    type: file.type.includes('pdf') ? 'PDF' : file.type.includes('word') ? 'Word' : 'Fichier',
                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    uploadDate: new Date().toLocaleDateString('fr-FR')
                };
                setAttachments([...attachments, newAttachment]);
            });

            toast({
                title: "Fichier(s) ajouté(s)",
                description: `${files.length} fichier(s) ont été ajoutés avec succès.`,
            });
        }
    };

    const handleDeleteAttachment = (id: number) => {
        setAttachments(attachments.filter(a => a.id !== id));
        toast({
            title: "Fichier supprimé",
            description: "Le fichier a été supprimé avec succès.",
            variant: "destructive",
        });
    };

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

    if (!training) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Chargement…
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
                                        {training.departments.map((dpt) => (
                                            <div key={dpt.id}>
                                                <Label>Département</Label>
                                                <p>{dpt.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Durée</Label>
                                        <p className="font-medium">{training.duration} heures</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Participants max</Label>
                                        <p className="font-medium">{training.maxParticipants}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Management */}
                        <TrainingsDetailBody />

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
                                        <FeedbackTabs pageSize={20} />
                                    </TabsContent>

                                    <TabsContent value="pending">
                                        <FeedbackPending pageSize={20} />
                                    </TabsContent>
                                </Tabs>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default TrainingDetail;