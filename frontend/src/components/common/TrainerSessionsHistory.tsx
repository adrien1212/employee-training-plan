import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import { SessionDetail } from '@/types/SessionDetail';
import { useState } from 'react';
import FeedbackPopup from './FeedbackPopup';

interface Props {
    items: SessionDetail[];
    page: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
}

function TrainerSessionsHistory({ items, page, totalPages, loading, onPageChange }: Props) {
    const [selected, setSelected] = useState<SessionDetail | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const openModal = (session: SessionDetail) => {
        setSelected(session)
        setIsOpen(true)
    }
    const closeModal = () => {
        setSelected(null)
        setIsOpen(false)
    }

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Chargement…</div>;
    }
    if (!items.length) {
        return <div className="p-4 text-center text-gray-500">Aucune donnée</div>;
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Formation</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Feedbacks</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((session) => (
                        <TableRow key={session.id}>
                            <TableCell>
                                <div className="font-medium">{session.training.title}</div>
                            </TableCell>
                            <TableCell>{session.startDate}</TableCell>
                            <TableCell>{session.status}</TableCell>
                            <TableCell>
                                <Button onClick={() => openModal(session)}>
                                    Feedbacks
                                </Button>
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

            {/* Feedback Popup */}
            {selected && (
                <FeedbackPopup
                    open={isOpen}
                    onClose={closeModal}
                    session={selected}
                />
            )}
        </>
    );
}

export default TrainerSessionsHistory;