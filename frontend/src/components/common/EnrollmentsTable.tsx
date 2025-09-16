// components/EnrollmentsTable.tsx
import {
    Table, TableHeader, TableRow,
    TableHead, TableBody, TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import Pagination from '../pagination/Pagination';
import { SessionEnrollment } from '@/types/SessionEnrollment';


interface Props {
    items: SessionEnrollment[];
    loading: boolean;
    page: number;
    totalPages: number;
    showSearch?: boolean;
    searchTerm?: string;
    onSearchChange?: (newTerm: string) => void;
    searchResults?: { id: number; firstName: string; lastName: string; email: string }[];
    onAddEmployee?: (empId: number) => void;
    onRemoveEmployee: (empId: number) => void;
    onPageChange: (newPage: number) => void;
    showSessionStatus?: boolean;
}

const statusMap: Record<string, { label: string; style: string }> = {
    NOT_STARTED: { label: 'Programmée', style: 'bg-blue-100 text-blue-800' },
    ACTIVE: { label: 'En cours', style: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Terminée', style: 'bg-gray-100 text-gray-800' },
    CANCELLED: { label: 'Annulée', style: 'bg-red-100 text-red-800' },
    DRAFT: { label: 'À l’étude', style: 'bg-orange-100 text-orange-800' },
};

export default function EnrollmentsTable({
    items,
    loading,
    page,
    totalPages,
    showSearch = false,
    searchTerm = '',
    onSearchChange,
    searchResults = [],
    onAddEmployee,
    onRemoveEmployee,
    onPageChange,
    showSessionStatus = false,
}: Props) {
    const getInitials = (f: string, l: string) =>
        `${f[0]}${l[0]}`.toUpperCase();

    const getStatusBadge = (status: string) => {
        const cfg = statusMap[status] || statusMap.DRAFT;
        return <Badge className={cfg.style}>{cfg.label}</Badge>;
    };

    const getSignatureBadge = (signed: boolean) => {
        const cfg = signed
            ? { label: 'Signée', style: 'bg-green-100 text-green-800' }
            : { label: 'En attente', style: 'bg-orange-100 text-orange-800' };
        return <Badge className={cfg.style}>{cfg.label}</Badge>;
    };

    return (
        <>
            {showSearch && onSearchChange && onAddEmployee && (
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Rechercher un employé pour l'ajouter …"
                        value={searchTerm}
                        onChange={e => onSearchChange(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />

                    {searchTerm.length >= 3 && (
                        <ul className="bg-white border rounded mt-2 max-h-48 overflow-auto">
                            {searchResults.map(emp => (
                                <li
                                    key={emp.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => onAddEmployee(emp.id)}
                                >
                                    {emp.firstName} {emp.lastName} — {emp.email}
                                </li>
                            ))}
                            {searchResults.length === 0 && (
                                <li className="p-2 text-gray-500">Aucun résultat</li>
                            )}
                        </ul>
                    )}
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Signé</TableHead>
                        {showSessionStatus && <TableHead>Session</TableHead>}
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.map(item => {
                        const fbCfg = item.hasFeedback
                            ? { label: 'oui', style: 'bg-green-100 text-green-800' }
                            : { label: 'non', style: 'bg-red-100   text-orange-800' };
                        return (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback className="bg-blue-100 text-blue-700">
                                                {getInitials(
                                                    item.employee.firstName,
                                                    item.employee.lastName
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {item.employee.firstName}{' '}
                                                {item.employee.lastName}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                AccesToken : {item.sessionEnrollmentToken}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>{item.employee.email}</TableCell>
                                <TableCell>{item.session.startDate}</TableCell>
                                <TableCell>
                                    <Badge className={fbCfg.style}>{fbCfg.label}</Badge>
                                </TableCell>
                                <TableCell>
                                    {getSignatureBadge(item.hasSigned)}
                                </TableCell>

                                {showSessionStatus && (
                                    <TableCell>
                                        #{item.session.alias} {getStatusBadge(item.session.status)}
                                    </TableCell>
                                )}

                                <TableCell>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onRemoveEmployee(item.employee.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
