// src/components/EmployeeTable.tsx
import React, { useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Edit, Mail, Play, Trash2, ChevronDown, ChevronUp, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
import { Employee } from '@/types/Employee'
import EmployeeDialog from './EmployeeDialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { PageResponse } from '@/types/PageResponse'
import { Department } from '@/types/Department'
import { useDepartments } from '@/hooks/useDepartments'
import {
    useEmployees,
    useDeleteEmployee,
} from '@/hooks/useEmployees'
import useSlotsSignature, { useOpenSignature } from '@/hooks/useSlotSignature'
import { SlotSignature } from '@/types/SlotSignature'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { DialogFooter, DialogHeader } from '../ui/dialog'
import MissingSignature from './MissingSignature'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { SlotSignatureStatus } from '@/types/SlotSignatureStatus'

interface Props {
    sessionId: number
}

const statusMap: Record<SlotSignatureStatus, { label: string; style: string }> = {
    NOT_STARTED: { label: "Non commencé", style: 'bg-gray-100 text-gray-800' },
    OPEN: { label: 'Ouvert', style: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Complété', style: 'bg-red-100 text-red-800' },
};

export default function EmployeeTable({ sessionId }: Props) {
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [slotToRun, setSlotToRun] = useState<SlotSignature | null>(null)
    const [expandedSlot, setExpandedSlot] = useState<number | null>(null)
    const { mutate: openSignature, isLoading, error } = useOpenSignature()
    const [copying, setCopying] = useState(false)
    // — READ
    const {
        data: empResponse,
        isLoading: isEmpLoading,
        error: empError,
    } = useSlotsSignature({ sessionId, page, size: pageSize })

    const items: SlotSignature[] = empResponse?.content ?? []
    const totalPages: number = empResponse?.totalPages ?? 0

    const handlePlayClick = (slotSignature: SlotSignature) => {
        setSlotToRun(slotSignature)
        setConfirmOpen(true)
    }

    const activeSignature = (slotSignature: SlotSignature | null) => {
        if (slotSignature) openSignature(slotSignature.id)
    }

    const toggleExpand = (id: number) => {
        setExpandedSlot(prev => (prev === id ? null : id))
    }

    const getStatusBadge = (status: SlotSignature['status']) => {
        console.log(status)
        const cfg = statusMap[status];
        return <Badge className={cfg.style}>{cfg.label}</Badge>;
    };


    if (isEmpLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (empError) return <div className="p-4 text-center text-red-500">Erreur de chargement</div>

    const getConfig = (v: boolean) => {
        return v
            ? { color: 'bg-green-100 text-green-800', label: 'oui' }
            : { color: 'bg-red-100 text-orange-800', label: 'non' }
    }

    const handleCopy = async (token: string) => {
        const base = process.env.REACT_APP_BASE_URL || window.location.origin
        const fullUrl = `${base}/${token}`
        console.log(fullUrl)
        try {
            setCopying(true)
            await navigator.clipboard.writeText(fullUrl)
        } catch (err) {
            console.error('Copy failed', err)
        } finally {
            setCopying(false)
        }
    }

    return (
        <>
            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmer le démarrage</DialogTitle>
                        <DialogDescription>
                            {'Êtes-vous sûr·e de vouloir démarrer le créneau, ceci débloque les signatures ?'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="space-x-2">
                        <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                activeSignature(slotToRun)
                                setConfirmOpen(false)
                            }}
                        >
                            Confirmer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucun créneau trouvé</div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Créneaux à signer</CardTitle>
                        <CardDescription>
                            Liste des créneaux signés ou à signer par les participants
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Période</TableHead>
                                    <TableHead>Token</TableHead>
                                    <TableHead>Signature activée</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map(slot => (
                                    <React.Fragment key={slot.id}>
                                        <TableRow>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            toggleExpand(slot.id)
                                                        }}
                                                        className="p-0"
                                                    >
                                                        {expandedSlot === slot.id ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Mail className="h-4 w-4" />
                                                    {slot.slotDate}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    {slot.periode}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    className="flex items-center gap-2 cursor-pointer"
                                                    onClick={() => handleCopy(slot.token)}
                                                    title="Copy full URL"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                    <span>slot/{slot.token}</span>
                                                    {copying && <small className="text-xs italic">Copying…</small>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(slot.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            handlePlayClick(slot)
                                                        }}
                                                        className="p-0 h-8 w-8"
                                                    >
                                                        <Play className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {expandedSlot === slot.id && (
                                            <TableRow>
                                                <MissingSignature slotSignatureId={slot.id} />
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
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
                        onValueChange={value => {
                            setPageSize(Number(value))
                            setPage(0)
                        }}
                    >
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50].map(s => (
                                <SelectItem key={s} value={s.toString()}>
                                    {s} / page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    )
}
