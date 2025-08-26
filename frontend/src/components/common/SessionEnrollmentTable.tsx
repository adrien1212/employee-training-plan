// components/SessionEnrollmentCard.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import EnrollmentsTable from './EnrollmentsTable';
import { Users } from 'lucide-react';
import { useSessionsEnrollment } from '@/hooks/useSessionEnrollments';
import { useEmployeesSearch } from '@/hooks/useEmployees';
import { toast } from '@/hooks/use-toast';
import { useSubscribeEmployeeToSession, useUnsubscribeEmployeeFromSession } from '@/hooks/useSessions';

const PAGE_SIZE = 10;

interface SessionEnrollmentCardProps {
    sessionId: number;
}

const SessionEnrollmentCard: React.FC<SessionEnrollmentCardProps> = ({ sessionId }) => {
    const [page, setPage] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading, error, refetch } = useSessionsEnrollment({
        sessionId,
        page,
        size: PAGE_SIZE,
    });

    const {
        data: searchResp,
        isLoading: searchLoading,
    } = useEmployeesSearch({
        page: 0, size: 10,
        firstName: searchTerm.length >= 3 ? searchTerm : undefined,
        lastName: searchTerm.length >= 3 ? searchTerm : undefined,
        email: searchTerm.length >= 3 ? searchTerm : undefined,
    });

    // New hooks
    const { mutate: subscribeEmployee } = useSubscribeEmployeeToSession(sessionId);
    const { mutate: unsubscribeEmployee } = useUnsubscribeEmployeeFromSession(sessionId);

    const handleAdd = (empId: number) => {
        subscribeEmployee(empId, {
            onSuccess: () => {
                toast({ title: 'Employé ajouté', description: 'Inscription OK.' });
                setSearchTerm('');
                refetch();
            },
            onError: () => {
                toast({ title: 'Erreur', description: 'Échec ajout.', variant: 'destructive' });
            },
        });
    };

    const handleRemove = (empId: number) => {
        unsubscribeEmployee(empId, {
            onSuccess: () => {
                toast({ title: 'Succès', description: 'Employé retiré.' });
                refetch();
            },
            onError: () => {
                toast({ title: 'Erreur', description: 'Échec supp.', variant: 'destructive' });
            },
        });
    };

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
                    showSearch
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchResults={searchResp?.content || []}
                    onAddEmployee={handleAdd}
                    onRemoveEmployee={handleRemove}
                    showSessionStatus
                />
            </CardContent>
        </Card>
    );
};

export default SessionEnrollmentCard;