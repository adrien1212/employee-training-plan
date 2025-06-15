import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Save, Download, Trash2, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Attachment {
    id: number;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
}

const TrainerSpace = () => {
    const { trainingAccessToken } = useParams();
    const { toast } = useToast();
    const [content, setContent] = useState("");
    const [attachments, setAttachments] = useState<Attachment[]>([
        { id: 1, name: "support-cours.pdf", type: "PDF", size: "2.5 MB", uploadDate: "2024-06-08" },
        { id: 2, name: "exercices.docx", type: "Word", size: "1.2 MB", uploadDate: "2024-06-08" },
    ]);

    // Mock training data
    const training = {
        id: 1,
        name: "Sécurité au travail",
        description: "Formation obligatoire sur les règles de sécurité en entreprise",
        instructor: "Dr. Martin Leclerc",
        duration: 8,
        department: "Production"
    };

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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Edit3 className="h-6 w-6 text-blue-600" />
                            Espace Formateur - {training.name}
                        </CardTitle>
                        <CardDescription>
                            Gérez le contenu et les ressources de votre formation
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Formateur :</span>
                                <span className="font-medium ml-2">{training.instructor}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Durée :</span>
                                <span className="font-medium ml-2">{training.duration}h</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Département :</span>
                                <span className="font-medium ml-2">{training.department}</span>
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
            </div>
        </div>
    );
};

export default TrainerSpace;