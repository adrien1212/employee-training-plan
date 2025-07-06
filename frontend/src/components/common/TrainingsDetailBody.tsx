import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Download, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api";
import { useListTrainingDocuments, useUploadTrainingDocument, useDownloadTrainingDocument, useDeleteTrainingDocument } from "@/hooks/useTrainingAttachment";

const TrainingDetailBody = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [content, setContent] = useState("");
    const [trainingName, setTrainingName] = useState<string>("");

    // Fetch training metadata
    useEffect(() => {
        const fetchTraining = async () => {
            try {
                const res = await api.get(`/v1/trainings/${id}`);
                setTrainingName(res.data.title || res.data.name || "");
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

    // React Query hooks for attachments
    const {
        data: attachments,
        isLoading: isLoadingAttachments,
        isError: isLoadingError,
    } = useListTrainingDocuments({ trainingId: Number(id), page: 0, size: 10 });

    const uploadMutation = useUploadTrainingDocument();
    const downloadMutation = useDownloadTrainingDocument();
    const deleteMutation = useDeleteTrainingDocument();


    const handleSaveContent = () => {
        // Save content via API
        api
            .put(`/v1/trainings/${id}`, { content })
            .then(() => {
                toast({
                    title: "Contenu sauvegardé",
                    description: "Les informations de la formation ont été mises à jour.",
                });
            })
            .catch(() => {
                toast({
                    title: "Erreur de sauvegarde",
                    description: "Échec de la mise à jour du contenu.",
                    variant: "destructive",
                });
            });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                uploadMutation.mutate(
                    { trainingId: Number(id), file },
                    {
                        onSuccess: data => {
                            toast({
                                title: "Fichier ajouté",
                                description: `${data.filename} téléchargé avec succès.`,
                            });
                        },
                        onError: () => {
                            toast({
                                title: "Erreur de téléchargement",
                                description: `Échec du téléchargement de ${file.name}.`,
                                variant: "destructive",
                            });
                        },
                    }
                );
            });
        }
    };

    const handleDeleteAttachment = (docId: string) => {
        deleteMutation.mutate(
            { trainingId: Number(id), documentId: docId },
            {
                onSuccess: () => {
                    toast({
                        title: "Fichier supprimé",
                        description: "Le fichier a été supprimé avec succès.",
                        variant: "destructive",
                    });
                },
                onError: () => {
                    toast({
                        title: "Erreur de suppression",
                        description: "Impossible de supprimer le fichier.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    const handleDownload = (docId: string, filename: string) => {
        downloadMutation.mutate(
            { trainingId: Number(id), documentId: docId },
            {
                onSuccess: blob => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    URL.revokeObjectURL(url);
                },
                onError: () => {
                    toast({
                        title: "Erreur de téléchargement",
                        description: "Échec du téléchargement du fichier.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    if (isLoadingAttachments)
        return <div className="p-4 text-center text-gray-500">Chargement…</div>;
    if (isLoadingError)
        return <div className="p-4 text-center text-red-500">Erreur de chargement</div>;

    if (!isLoadingAttachments) {
        console.log(attachments)
    }

    return (
        <div>
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
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Rédigez ici..."
                                    className="min-h-[400px] mt-2"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    {content.length} caractères
                                </p>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline">Aperçu</Button>
                                <Button onClick={handleSaveContent} className="bg-blue-600 hover:bg-blue-700">
                                    <Save className="h-4 w-4 mr-2" /> Sauvegarder
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

                            {!isLoadingAttachments && attachments.content.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-900">
                                        Fichiers attachés ({attachments.content.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {attachments.content.map(att => (
                                            <div
                                                key={att.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-8 w-8 text-blue-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {att.filename}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            • {att.size} • {att.uploadedAt}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDownload(att.id, att.filename)}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteAttachment(att.id)}
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
        </div>
    );
};

export default TrainingDetailBody;
