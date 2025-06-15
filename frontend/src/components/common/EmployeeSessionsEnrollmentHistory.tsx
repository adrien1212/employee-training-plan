import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import useFeedback from '@/hooks/useFeedback';

interface Props {
    items: SessionEnrollment[];
    page: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
}

function EmployeeSessionsEnrollmentHistory({ items, page, totalPages, loading, onPageChange }: Props) {
    if (loading) {
        return <div className="p-4 text-center text-gray-500">Chargement…</div>;
    }
    if (!items.length) {
        return <div className="p-4 text-center text-gray-500">Aucune donnée</div>;
    }

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
                            <TableCell>{sessionEnrollment.session.status}</TableCell>
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