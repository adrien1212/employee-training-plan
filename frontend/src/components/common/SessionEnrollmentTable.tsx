// components/SessionEnrollmentCard.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import EnrollmentsTable from './EnrollmentsTable';
import { Users } from 'lucide-react';
import { useSessionsEnrollment } from '@/hooks/useSessionEnrollments';
import { useEmployeesSearch } from '@/hooks/useEmployees';
import api from '@/services/api';
import { toast } from '@/hooks/use-toast';

const PAGE_SIZE = 10;

interface SessionEnrollmentCardProps {
    sessionId: number;
}

const SessionEnrollmentCard: React.FC<SessionEnrollmentCardProps> = ({ sessionId }) => {
    const [page, setPage] = useState<number>(0);

    const { data, isLoading, error, refetch } = useSessionsEnrollment({
        sessionId,
        page,
        size: PAGE_SIZE,
    });

    const [items, setItems] = useState<any[]>([]);
    const [totalPages, setTotal] = useState(1);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const {
        data: searchResp,
        isLoading: searchLoading,
    } = useEmployeesSearch({
        page: 0, size: 10,
        firstName: searchTerm.length >= 3 ? searchTerm : undefined,
        lastName: searchTerm.length >= 3 ? searchTerm : undefined,
        email: searchTerm.length >= 3 ? searchTerm : undefined,
    });

    const handleAdd = (empId: number) => {
        api.post(`/v1/sessions/${sessionId}/subscribe/${empId}`)
            .then(() => {
                toast({ title: 'Employé ajouté', description: 'Inscription OK.' });
                setSearchTerm('');
                // refresh list
                return api.get(`/v1/sessions/${sessionId}/enrollments`, { params: { page } });
            })
            .then(res => setItems(res.data.content))
            .catch(() => toast({ title: 'Erreur', description: 'Échec ajout.', variant: 'destructive' }));
    };

    const handleRemove = (empId: number) => {
        api.delete(`/v1/sessions/${sessionId}/subscribe/${empId}`)
            .then(() => {
                toast({ title: 'Succès', description: 'Employé retiré.' });
                setItems(items.filter(i => i.id !== empId));
            })
            .catch(() => toast({ title: 'Erreur', description: 'Échec supp.', variant: 'destructive' }));
    };

    useEffect(() => {
        setLoading(true);
        api.get(`/v1/sessions/${sessionId}/enrollments`, { params: { page } })
            .then(res => {
                setItems(res.data.content);
                setTotal(res.data.totalPages);
            })
            .finally(() => setLoading(false));
    }, [sessionId, page]);

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
