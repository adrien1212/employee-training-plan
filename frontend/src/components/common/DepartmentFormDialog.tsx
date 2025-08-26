import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Department } from '@/types/Department';
import { useCreateDepartment } from '@/hooks/useDepartments';

type DepartmentFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit?: (form: { name: string }) => void;
};

export const DepartmentFormDialog: React.FC<DepartmentFormDialogProps> = ({
    open,
    onOpenChange,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({ name: "" });
    const createMutation = useCreateDepartment();
    const isSubmitting = createMutation.isLoading;

    useEffect(() => {
        if (!open) setFormData({ name: "" }); // reset when dialog closes
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync({ departmentName: formData.name });
            onSubmit?.(formData);
            onOpenChange(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Département
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer un nouveau département</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations pour créer un nouveau département.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nom du département</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ name: e.target.value })}
                            placeholder="Ex: Ressources Humaines"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {createMutation.isError && (
                        <p className="text-sm text-red-600">
                            Une erreur est survenue. Veuillez réessayer.
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Création..." : "Créer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};