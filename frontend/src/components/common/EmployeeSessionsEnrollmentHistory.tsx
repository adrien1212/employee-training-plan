import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import { SessionStatus } from '@/types/SessionStatus';
import { SessionDetail } from '@/types/SessionDetail';
import { Badge } from '../ui/badge';

interface Props {
    items: SessionEnrollment[];
    page: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
}

const statusMap: Record<SessionStatus, { label: string; style: string }> = {
    DRAFT: { label: "À l'étude", style: 'bg-orange-100 text-orange-800' },
    NOT_STARTED: { label: 'Programmée', style: 'bg-blue-100 text-blue-800' },
    ACTIVE: { label: 'En cours', style: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Terminée', style: 'bg-gray-100 text-gray-800' },
    CANCELLED: { label: 'Annulée', style: 'bg-red-100 text-red-800' },
};

function EmployeeSessionsEnrollmentHistory({ items, page, totalPages, loading, onPageChange }: Props) {
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

    const renderStars = (rating: number) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    return (
        <>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Formation</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Évaluation</TableHead>
                        <TableHead>Commentaire</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((sessionEnrollment) => (
                        <TableRow key={sessionEnrollment.id}>
                            <TableCell>
                                <div className="font-medium">{sessionEnrollment.session.training.title}</div>
                            </TableCell>
                            <TableCell>{sessionEnrollment.session.startDate}</TableCell>
                            <TableCell>{getStatusBadge(sessionEnrollment.session.status)}</TableCell>
                            <TableCell>
                                {sessionEnrollment.feedback ? (
                                    <div className="text-yellow-500">
                                        {renderStars(sessionEnrollment.feedback.rating)}
                                    </div>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {sessionEnrollment.feedback ? (
                                    <div className="max-w-xs truncate" title={sessionEnrollment.feedback.comment}>
                                        {sessionEnrollment.feedback.comment}
                                    </div>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center p-4">
                    <Button
                        disabled={page <= 0}
                        onClick={() => onPageChange(page - 1)}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {page + 1} of {totalPages}
                    </span>
                    <Button
                        disabled={page + 1 >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </>
    );
}

export default EmployeeSessionsEnrollmentHistory;