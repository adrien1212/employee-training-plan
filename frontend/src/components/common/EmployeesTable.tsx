// src/components/EmployeeTable.tsx
import React, { useState, useEffect } from 'react'
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
    useEmployeesSearch,
} from '@/hooks/useEmployees'
import { useCurrentPlan } from '@/hooks/usePlan'
import Pagination from '../pagination/Pagination'

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

    // Search state
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

    // Debounce search input (300ms)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setPage(0)
        }, 300)
        return () => clearTimeout(handler)
    }, [searchTerm])

    const {
        data: plan,
        isLoading: isPlanLoading,
        isError: isPlanError,
    } = useCurrentPlan()

    // — READ with search filter after min length
    const {
        data: empResponse,
        isLoading: isEmpLoading,
        error: empError,
    } = useEmployeesSearch({
        departmentId,
        sessionId,
        page,
        size: pageSize,
        firstName: debouncedSearchTerm.length >= 3 ? debouncedSearchTerm : undefined,
        lastName: debouncedSearchTerm.length >= 3 ? debouncedSearchTerm : undefined,
        email: debouncedSearchTerm.length >= 3 ? debouncedSearchTerm : undefined,
    })

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

    const items = empResponse?.content ?? []
    const departments = deptResponse?.content ?? []
    const totalPages: number = empResponse?.page.totalPages ?? 0

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

    if (isEmpLoading || isPlanLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (empError || deptError || isPlanError) return <div className="p-4 text-center text-red-500">Erreur de chargement</div>


    return (
        <>
            {/* Search Box */}
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Rechercher (min 3 caractères)..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="border rounded p-2 w-full mb-4"
                />
            </div>

            {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucun employé trouvé.</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employé</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Code Employé</TableHead>
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
            <Pagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                busy={busy}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
            />

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
