import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Department } from "@/types/Department";
import { Training } from "@/types/Training";

interface TrainingFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    departments: Department[];
    editingTraining: Training | null;
    onSubmit: (data: Partial<Training>) => void;
}

export const TrainingFormDialog: React.FC<TrainingFormDialogProps> = ({
    isOpen,
    onOpenChange,
    departments,
    editingTraining,
    onSubmit,
}) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        provider: "",
        departmentIds: [] as number[],
        duration: 0,
        maxParticipants: 0,
    });

    useEffect(() => {
        if (editingTraining) {
            setFormData({
                title: editingTraining.title,
                description: editingTraining.description,
                provider: editingTraining.provider,
                departmentIds: departments.map((d) => d.id),
                duration: editingTraining.duration,
                maxParticipants: editingTraining.maxParticipants,
            });
        }
    }, [editingTraining]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button onClick={() => onOpenChange(true)} className="bg-blue-600 hover:bg-blue-700">
                    Nouvelle Formation
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingTraining ? "Modifier la formation" : "Créer une nouvelle formation"}</DialogTitle>
                    <DialogDescription>
                        {editingTraining
                            ? "Modifiez les informations de la formation ci-dessous."
                            : "Remplissez les informations pour créer une nouvelle formation."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nom de la formation</Label>
                        <Input
                            id="name"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ex: Sécurité au travail"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Description de la formation..."
                            required
                        />
                    </div>
                    <div>
                        <Label>Dépendances cibles</Label>
                        <div className="space-y-2 mt-1">
                            {departments.map((dept) => (
                                <div key={dept.id} className="flex items-center">
                                    <input
                                        id={`dept-${dept.id}`}
                                        type="checkbox"
                                        checked={formData.departmentIds.includes(dept.id)}
                                        onChange={(e) => {
                                            const newIds = e.target.checked
                                                ? [...formData.departmentIds, dept.id]
                                                : formData.departmentIds.filter((id) => id !== dept.id);
                                            setFormData({ ...formData, departmentIds: newIds });
                                        }}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <Label htmlFor={`dept-${dept.id}`} className="ml-2 text-gray-700">
                                        {dept.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="duration">Durée (heures)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                placeholder="8"
                                min="1"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="maxParticipants">Max participants</Label>
                            <Input
                                id="maxParticipants"
                                type="number"
                                value={formData.maxParticipants}
                                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                                placeholder="20"
                                min="1"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            {editingTraining ? "Modifier" : "Créer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};