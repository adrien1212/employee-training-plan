import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Training } from '@/types/Training';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '@/hooks/useSessions';
import { SessionStatus } from '@/types/SessionStatus';

interface Props {
    items: Training[];
    page: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
}


function TrainingRow({ training }: { training: Training }) {
    const navigate = useNavigate()
    const {
        data: sessions,
        isLoading: sessionsLoading,
        isError: sessionsError,
    } = useSessions({
        trainingId: training.id,
        sessionStatus: SessionStatus.NotStarted,
    })

    if (sessionsLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (sessionsError) return <div className="p-4 text-center text-gray-500">Erreur</div>

    return (
        <TableRow
            key={training.id}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/trainings/${training.id}`)}
        >
            <TableCell>
                <div className="font-medium">{training.title}</div>
            </TableCell>
            <TableCell>{training.description}</TableCell>
            <TableCell>{training.duration}h</TableCell>
            <TableCell>
                <Badge variant="secondary">{sessions.totalElements}</Badge>
            </TableCell>
        </TableRow>
    )
}

export default function TrainingsTable({ items, page, totalPages, loading, onPageChange }: Props) {
    if (loading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (!items.length) return <div className="p-4 text-center text-gray-500">Aucune donnée</div>

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Formation</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Sessions Programmées</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map(training => (
                        <TrainingRow key={training.id} training={training} />
                    ))}
                </TableBody>
            </Table>

            {!loading && totalPages > 1 && (
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
            )}
        </>
    )
}