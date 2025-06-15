import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SessionDetail } from "@/types/SessionDetail";
import api from "@/services/api";
import { PageResponse } from "@/types/PageResponse";
import { Badge } from '../ui/badge';


interface SessionTodayProps {
    trainingId?: string;
}

const SessionsToday: React.FC<SessionTodayProps> = ({ trainingId }) => {
    const [sessionsToday, setSessionsToday] = useState<SessionDetail[]>([]);

    useEffect(() => {
        const fetchAndFilter = async () => {
            try {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const todayStr = `${yyyy}-${mm}-${dd}`;
                const res = await api.get<PageResponse<SessionDetail>>(
                    '/v1/sessions',
                    { params: { trainingId, startDate: todayStr, endDate: todayStr, page: 0, size: 100 } }
                );

                setSessionsToday(res.data.content);
            } catch (err) {
                console.error('Error fetching sessions', err);
            }
        };

        fetchAndFilter();
    }, [trainingId]);

    const getStatusBadge = (status: SessionDetail['status']) => {
        const variants = {
            SCHEDULED: { variant: "default", label: "Programmée", color: "bg-blue-100 text-blue-800" },
            ACTIVE: { variant: "default", label: "En cours", color: "bg-green-100 text-green-800" },
            COMPLETED: { variant: "secondary", label: "Terminée", color: "bg-gray-100 text-gray-800" },
            CANCELLED: { variant: "destructive", label: "Annulée", color: "bg-red-100 text-red-800" },
            NOT_STARTED: { variant: "secondary", label: 'Programmée', style: 'bg-blue-100 text-blue-800' },
        };

        console.log(status)
        const config = variants[status];
        return (
            <Badge className={config.color}>
                {config.label}
            </Badge>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sessions du jour</CardTitle>
            </CardHeader>
            <CardContent>
                {sessionsToday.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Formation</TableHead>
                                <TableHead>Date de début</TableHead>
                                <TableHead>Date de fin</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessionsToday.map(session => (
                                <TableRow key={session.id}>
                                    <TableCell>{session.training.title}</TableCell>
                                    <TableCell>{session.startDate}</TableCell>
                                    <TableCell>{session.endDate}</TableCell>
                                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p>Aucune session n'est programmée pour aujourd'hui.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default SessionsToday;
