import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Trainer } from '@/types/Trainer'
import { NewTrainer } from '@/types/NewTrainer'
import {
    useCreateTrainer,
    useUpdateTrainer
} from '@/hooks/useTrainer'

interface TrainerDialogProps {
    open: boolean
    editingTrainer: Trainer | null
    onClose: () => void
}

export default function TrainerDialog({ open, editingTrainer, onClose }: TrainerDialogProps) {
    const { mutate: createTrainer, isLoading: isCreating } = useCreateTrainer()
    const { mutate: updateTrainer, isLoading: isUpdating } = useUpdateTrainer()

    const [formData, setFormData] = useState<NewTrainer>({
        firstName: '',
        lastName: '',
        email: '',
        speciality: '',
    })

    useEffect(() => {
        if (editingTrainer) {
            setFormData({
                firstName: editingTrainer.firstName,
                lastName: editingTrainer.lastName,
                email: editingTrainer.email,
                speciality: editingTrainer.speciality,
            })
        } else {
            setFormData({ firstName: '', lastName: '', email: '', speciality: '' })
        }
    }, [editingTrainer])

    const isBusy = isCreating || isUpdating

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingTrainer) {
            updateTrainer(
                { id: editingTrainer.id, data: formData },
                { onSuccess: () => onClose() }
            )
        } else {
            createTrainer(formData, { onSuccess: () => onClose() })
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {editingTrainer ? 'Modifier formateur' : 'Nouveau formateur'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingTrainer
                            ? 'Mettez à jour les informations du formateur'
                            : "Ajoutez un nouveau formateur à l'équipe"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">Prénom *</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Nom *</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="speciality">Spécialités (séparées par des virgules)</Label>
                        <Input
                            id="speciality"
                            value={formData.speciality}
                            onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                            placeholder="Sécurité, Management, Informatique"
                        />
                    </div>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose} disabled={isBusy}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isBusy}>
                            {editingTrainer ? 'Enregistrer' : 'Ajouter'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}