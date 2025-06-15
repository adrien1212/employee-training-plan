// components/SessionEnrollmentCard.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import EnrollmentsTable from './EnrollmentsTable';
import { Users } from 'lucide-react';
import { useSessionsEnrollment } from '@/hooks/useSessionEnrollments';

const PAGE_SIZE = 10;

interface SessionEnrollmentCardProps {
    sessionId: number;
}

const SessionEnrollmentCard: React.FC<SessionEnrollmentCardProps> = ({ sessionId }) => {
    const [page, setPage] = useState<number>(0);

    const { data, isLoading, error } = useSessionsEnrollment({
        sessionId,
        page,
        size: PAGE_SIZE,
    });

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Participants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-red-500">Erreur de chargement.</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Participants
                </CardTitle>
                <CardDescription>
                    {data?.content?.length} participant(s) inscrit(s) à cette session
                </CardDescription>
            </CardHeader>
            <CardContent>
                <EnrollmentsTable
                    items={data?.content ?? []}
                    page={page}
                    totalPages={data?.totalPages ?? 1}
                    loading={isLoading}
                    onPageChange={newPage => setPage(newPage)}
                />
            </CardContent>
        </Card>
    );
};

export default SessionEnrollmentCard;
