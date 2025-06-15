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
                        <Tabs defaultValue="content" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="content">Contenu de la formation</TabsTrigger>
                                <TabsTrigger value="attachments">Pièces jointes</TabsTrigger>
                            </TabsList>

                            <TabsContent value="content" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Éditeur de contenu</CardTitle>
                                        <CardDescription>
                                            Rédigez et organisez le contenu de votre formation
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="content">Contenu de la formation</Label>
                                            <Textarea
                                                id="content"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="Rédigez ici le contenu de votre formation, les objectifs, le programme détaillé, les exercices, etc..."
                                                className="min-h-[400px] mt-2"
                                            />
                                            <p className="text-sm text-gray-500 mt-2">
                                                {content.length} caractères
                                            </p>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline">
                                                Aperçu
                                            </Button>
                                            <Button onClick={handleSaveContent} className="bg-blue-600 hover:bg-blue-700">
                                                <Save className="h-4 w-4 mr-2" />
                                                Sauvegarder
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="attachments" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Gestion des pièces jointes</CardTitle>
                                        <CardDescription>
                                            Ajoutez et gérez les documents de votre formation
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Upload Area */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <div className="space-y-2">
                                                <p className="text-lg font-medium text-gray-900">
                                                    Glissez-déposez vos fichiers ici
                                                </p>
                                                <p className="text-gray-600">ou</p>
                                                <Label htmlFor="file-upload" className="cursor-pointer">
                                                    <Button variant="outline" asChild>
                                                        <span>Parcourir les fichiers</span>
                                                    </Button>
                                                </Label>
                                                <Input
                                                    id="file-upload"
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Formats supportés: PDF, Word, PowerPoint, Excel
                                            </p>
                                        </div>

                                        {/* Attachments List */}
                                        {attachments.length > 0 && (
                                            <div className="space-y-3">
                                                <h3 className="font-medium text-gray-900">Fichiers attachés ({attachments.length})</h3>
                                                <div className="space-y-2">
                                                    {attachments.map((attachment) => (
                                                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <FileText className="h-8 w-8 text-blue-600" />
                                                                <div>
                                                                    <div className="font-medium text-gray-900">{attachment.name}</div>
                                                                    <div className="text-sm text-gray-600">
                                                                        {attachment.type} • {attachment.size} • {attachment.uploadDate}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button variant="ghost" size="sm">
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteAttachment(attachment.id)}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

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