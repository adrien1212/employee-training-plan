// src/components/EmployeeDialog.tsx
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Employee } from '@/types/Employee'
import { Department } from '@/types/Department'
import { NewEmployee } from '@/types/NewEmployee'
import {
    useCreateEmployee,
    useUpdateEmployee,
} from '@/hooks/useEmployees'

interface EmployeeDialogProps {
    open: boolean
    editingEmployee: Employee | null
    departments: Department[]
    onClose: () => void
}

export default function EmployeeDialog({
    open,
    editingEmployee,
    departments,
    onClose,
}: EmployeeDialogProps) {
    // CREATE
    const {
        mutate: createEmployee,
        isLoading: isCreating,
    } = useCreateEmployee()

    // UPDATE
    const {
        mutate: updateEmployee,
        isLoading: isUpdating,
    } = useUpdateEmployee()

    const [formData, setFormData] = useState<NewEmployee>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        departmentId: 0,
    })

    // Reset or populate when switching between add/edit
    useEffect(() => {
        if (editingEmployee) {
            setFormData({
                firstName: editingEmployee.firstName,
                lastName: editingEmployee.lastName,
                email: editingEmployee.email,
                phone: editingEmployee.phone,
                departmentId: editingEmployee.department.id,
            })
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                departmentId: 0,
            })
        }
    }, [editingEmployee])

    const isBusy = isCreating || isUpdating

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingEmployee) {
            updateEmployee(
                { id: editingEmployee.id, data: formData },
                { onSuccess: () => onClose() }
            )
        } else {
            createEmployee(formData, { onSuccess: () => onClose() })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingEmployee
                            ? "Modifier l'employé"
                            : "Ajouter un nouvel employé"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingEmployee
                            ? "Modifiez les informations de l'employé ci-dessous."
                            : "Remplissez les informations pour ajouter un nouvel employé."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        firstName: e.target.value,
                                    }))
                                }
                                required
                                disabled={isBusy}
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        lastName: e.target.value,
                                    }))
                                }
                                required
                                disabled={isBusy}
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={e =>
                                setFormData(prev => ({ ...prev, email: e.target.value }))
                            }
                            required
                            disabled={isBusy}
                        />
                    </div>

                    <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={e =>
                                setFormData(prev => ({ ...prev, phone: e.target.value }))
                            }
                            required
                            disabled={isBusy}
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <Label htmlFor="department">Département</Label>
                        <Select
                            value={String(formData.departmentId)}
                            onValueChange={val =>
                                setFormData(prev => ({ ...prev, departmentId: Number(val) }))
                            }
                            disabled={isBusy}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un département" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map(dept => (
                                    <SelectItem key={dept.id} value={String(dept.id)}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose} disabled={isBusy}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isBusy}>
                            {editingEmployee
                                ? isUpdating
                                    ? 'Modification…'
                                    : 'Modifier'
                                : isCreating
                                    ? 'Ajout…'
                                    : 'Ajouter'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
