// components/FeedbackPending.tsx
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { SessionStatus } from '@/types/SessionStatus';
import { useSessionsEnrollment } from '@/hooks/useSessionEnrollments';
import Pagination from '../pagination/Pagination';
import { useFeebackRelance } from '@/hooks/useFeedback';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import { toast } from '../ui/use-toast';



interface PendingFeedbackTableProps {
    trainingId?: number
    sessionId?: number,
    pageSize?: number;
}

const getInitials = (name: string) =>
    name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();

const FeedbackPending: React.FC<PendingFeedbackTableProps> = ({
    trainingId, sessionId
}) => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10)
    const {
        data,
        isLoading,
        error,
    } = useSessionsEnrollment({
        status: SessionStatus.Completed,
        sessionId: sessionId,
        trainingId: trainingId,
        isFeedbackGiven: false,
        page,
        size: pageSize,
    });

    const feedbackRelance = useFeebackRelance();

    // normalize into safe defaults
    const sessionsEnrollment = data?.content ?? [];
    const totalPages = data?.totalPages ?? 0;

    function onSendReminder(sessionEnrollment: SessionEnrollment) {
        console.log('Envoyer relance pour employeeId:', sessionEnrollment);
        feedbackRelance.mutate(sessionEnrollment.feedback.id, { onSuccess });
    }

    const onSuccess = () => {
        toast({ title: 'Relancé effectuée' });
    };

    if (isLoading)
        return (
            <div className="p-4 text-center text-gray-500">Chargement…</div>
        );

    // In case some other error happened (not a 204), you can still show an error
    if (error)
        return (
            <div className="p-4 text-center text-red-500">
                Une erreur est survenue.
            </div>
        );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Avis en attente</CardTitle>
                <CardDescription>
                    Participants qui n'ont pas encore donné leur avis
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Participant</TableHead>
                            <TableHead>Formation</TableHead>
                            <TableHead>Session alias</TableHead>
                            <TableHead>Date de session</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sessionsEnrollment.length > 0 ? (
                            sessionsEnrollment.map(pending => (
                                <TableRow key={pending.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback className="bg-orange-100 text-orange-700">
                                                    {getInitials(
                                                        `${pending.employee.firstName} ${pending.employee.lastName}`
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">
                                                    {pending.employee.firstName}{' '}
                                                    {pending.employee.lastName}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {pending.employee.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {pending.session.training.title}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        #{pending.session.alias}
                                    </TableCell>
                                    <TableCell>{pending.session.startDate}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                onSendReminder(pending)
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            <Send className="h-3 w-3" />
                                            Relance
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                    Aucun feedback en attente.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                />
            </CardContent>
        </Card>
    );
};

export default FeedbackPending;
