// src/components/common/TrainerTable.tsx
import React, { useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Edit } from 'lucide-react'
import { useTrainers } from '@/hooks/useTrainer'
import { Trainer } from '@/types/Trainer'
import TrainerDialog from './TrainerDialog'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useNavigate } from 'react-router-dom'

export default function TrainerTable() {
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null)

    const { data: response, isLoading } = useTrainers({ page, size: pageSize })
    const items = response?.content ?? []
    const totalPages = response?.totalPages ?? 0

    const getInitials = (first: string, last: string) =>
        `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()

    const openNew = () => {
        setEditingTrainer(null)
        setIsDialogOpen(true)
    }

    const openEdit = (trainer: Trainer) => {
        setEditingTrainer(trainer)
        setIsDialogOpen(true)
    }

    const closeDialog = () => {
        setIsDialogOpen(false)
        setEditingTrainer(null)
    }

    if (isLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button onClick={openNew}>
                    Nouveau Formateur
                </Button>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucun formateur trouvé.</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Formateur</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Spécialité</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map(trainer => (
                            <TableRow key={trainer.id} className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => navigate(`/trainers/${trainer.id}`)}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {getInitials(trainer.firstName, trainer.lastName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">
                                            {trainer.firstName} {trainer.lastName}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{trainer.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{trainer.speciality}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-0 h-8 w-8"
                                        onClick={e => { e.stopPropagation(); openEdit(trainer) }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 p-4">
                <div className="text-gray-600">
                    Page {page + 1} sur {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button disabled={page === 0} onClick={() => setPage(p => Math.max(p - 1, 0))}>
                        Précédent
                    </Button>
                    <Button disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>
                        Suivant
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="pageSizeSelect">Taille :</Label>
                    <Select
                        id="pageSizeSelect"
                        value={pageSize.toString()}
                        onValueChange={value => { setPageSize(Number(value)); setPage(0) }}
                    >
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50].map(size => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size} / page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Create / Edit Dialog */}
            <TrainerDialog
                open={isDialogOpen}
                editingTrainer={editingTrainer}
                onClose={closeDialog}
            />
        </>
    )
}