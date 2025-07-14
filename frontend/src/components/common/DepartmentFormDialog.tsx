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

interface DepartmentFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Department | null;
    onSubmit: (data: Omit<Department, 'id' | 'employeeCount'>) => void;
}

export const DepartmentFormDialog: React.FC<DepartmentFormDialogProps> = ({
    open,
    onOpenChange,
    initialData = null,
    onSubmit
}) => {
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name
            });
        } else {
            setFormData({ name: '' });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {initialData ? 'Modifier le département' : 'Nouveau Département'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Modifier le département' : 'Créer un nouveau département'}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? 'Modifiez les informations du département ci-dessous.'
                            : 'Remplissez les informations pour créer un nouveau département.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nom du département</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Ressources Humaines"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            {initialData ? 'Modifier' : 'Créer'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};