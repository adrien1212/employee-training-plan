import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import { SessionDetail } from '@/types/SessionDetail';
import { useNavigate } from 'react-router-dom';

interface Props {
    items: SessionEnrollment[];
    page: number;
    totalPages: number;
    loading: boolean;
    showSessionStatus?: boolean
    onPageChange: (newPage: number) => void;
}

const statusMap = {
    NOT_STARTED: { label: 'Programmée', style: 'bg-blue-100 text-blue-800' },
    ACTIVE: { label: 'En cours', style: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Terminée', style: 'bg-gray-100 text-gray-800' },
    CANCELLED: { label: 'Annulée', style: 'bg-red-100 text-red-800' },
    DRAFT: { label: "A l'étude", style: 'bg-red-100 text-orange-800' }
};

function EnrollmentsTable({ items, page, totalPages, loading, showSessionStatus, onPageChange }: Props) {
    const navigate = useNavigate()
    const getInitials = (f: string, l: string) => `${f[0]}${l[0]}`.toUpperCase();

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Chargement…</div>;
    }
    if (!items.length) {
        return <div className="p-4 text-center text-gray-500">Aucune donnée</div>;
    }

    const getStatusBadge = (status: SessionDetail['status']) => {
        const cfg = statusMap[status];
        return <Badge className={cfg.style}>{cfg.label}</Badge>;
    };

    const getSignatureBadge = (status: SessionEnrollment['hasSigned']) => {
        const variants = {
            signed: { color: "bg-green-100 text-green-800", label: "Signée" },
            pending: { color: "bg-orange-100 text-orange-800", label: "En attente" }
        };
        const config = status ? variants.signed : variants.pending
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Feedback donné</TableHead>
                        <TableHead>Signé</TableHead>
                        {showSessionStatus && (
                            <TableHead>Session</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map(item => {
                        const config = item.hasFeedback
                            ? { color: 'bg-green-100 text-green-800', label: 'oui' }
                            : { color: 'bg-red-100 text-orange-800', label: 'non' };
                        return (
                            <TableRow key={item.id} className="cursor-pointer hover:text-blue-600" onClick={() => navigate(`/employees/${item.employee.id}`)}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback className="bg-blue-100 text-blue-700">
                                                {getInitials(item.employee.firstName, item.employee.lastName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {item.employee.firstName} {item.employee.lastName}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{item.employee.email}</TableCell>
                                <TableCell>{item.session.startDate}</TableCell>
                                <TableCell>
                                    <Badge className={config.color}>
                                        {config.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {getSignatureBadge(item.hasSigned)}
                                </TableCell>
                                {showSessionStatus && (
                                    <TableCell>{getStatusBadge(item.session.status)}</TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center p-4">
                <Button disabled={loading || page <= 0} onClick={() => onPageChange(page - 1)}>
                    Précédent
                </Button>
                <span>
                    Page {page + 1} sur {totalPages}
                </span>
                <Button disabled={loading || page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
                    Suivant
                </Button>
            </div>
        </>
    );
}

export default EnrollmentsTable;