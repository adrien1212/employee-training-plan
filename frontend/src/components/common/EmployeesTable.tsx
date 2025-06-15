// src/components/EmployeeTable.tsx
import React, { useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Edit, Mail, Phone, Trash2 } from 'lucide-react'
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

interface Props {
    departmentId?: number
    sessionId?: number
}

export default function EmployeeTable({ departmentId, sessionId }: Props) {
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

    // — READ
    const {
        data: empResponse,
        isLoading: isEmpLoading,
        error: empError,
    } = useEmployees({ departmentId, sessionId, page, size: pageSize })

    // — DELETE
    const {
        mutate: deleteEmployee,
        isLoading: isDeleting,
    } = useDeleteEmployee({ departmentId, sessionId, page, size: pageSize })

    // — DEPARTMENTS (for dialog dropdown)
    const {
        data: deptResponse,
        isLoading: isDeptLoading,
        error: deptError,
    } = useDepartments()

    const items: Employee[] = empResponse?.content ?? []
    const departments: Department[] = deptResponse?.content ?? []
    const totalPages: number = empResponse?.totalPages ?? 0

    const busy = isDeleting || isDeptLoading

    const getInitials = (f: string, l: string) =>
        `${f[0]}${l[0]}`.toUpperCase()

    const openEdit = (emp: Employee) => {
        setEditingEmployee(emp)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteEmployee(id)
            toast({
                title: 'Employé supprimé',
                description: "L'employé a été supprimé.",
                variant: 'destructive',
            })
        } catch {
            toast({
                title: 'Erreur',
                description: 'Suppression impossible.',
                variant: 'destructive',
            })
        }
    }

    if (isEmpLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (empError || deptError) return <div className="p-4 text-center text-red-500">Erreur de chargement</div>

    return (
        <>
            {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucun employé trouvé.</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employé</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Code Employé</TableHead>
                            <TableHead>Téléphone</TableHead>
                            <TableHead>Département</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map(emp => (
                            <TableRow
                                key={emp.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => navigate(`/employees/${emp.id}`)}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {getInitials(emp.firstName, emp.lastName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">
                                            {emp.firstName} {emp.lastName}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {emp.email}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {emp.codeEmployee}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {emp.phone}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{emp.department.name}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={e => { e.stopPropagation(); openEdit(emp) }}
                                            disabled={busy}
                                            className="p-0 h-8 w-8"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={e => { e.stopPropagation(); handleDelete(emp.id) }}
                                            disabled={busy}
                                            className="p-0 h-8 w-8 text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
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
                        disabled={busy}
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

            {/* Create / Edit Dialog */}
            <EmployeeDialog
                open={isDialogOpen}
                editingEmployee={editingEmployee}
                departments={departments}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    )
}
