import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Training } from '@/types/Training';
import { useNavigate } from 'react-router-dom';

interface Props {
    items: Training[];
    page: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
}

function TrainingsTable({ items, page, totalPages, loading, onPageChange }: Props) {
    const navigate = useNavigate()

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
                        <TableHead>Description</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Max participants</TableHead>
                        <TableHead>Sessions</TableHead>
                        <TableHead>Statut</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((training) => (
                        <TableRow key={training.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/trainings/${training.id}`)}>
                            <TableCell>
                                <div className="font-medium">{training.title}</div>
                            </TableCell>
                            <TableCell>{training.description}</TableCell>
                            <TableCell>{training.duration}h</TableCell>
                            <TableCell>{training.maxParticipants}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{training.sessionsCount}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={training.status === 'active' ? 'default' : 'secondary'}>
                                    {training.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                        </TableRow>
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
    );
}

export default TrainingsTable;