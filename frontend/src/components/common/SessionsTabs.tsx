// src/components/SessionsTabs.tsx

import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, Play, BookmarkCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { SessionDetail } from '@/types/SessionDetail';
import { SessionStatus } from '@/types/SessionStatus';
import {
    useSessions,
    useDeleteSession,
    useUpdateSession,
    useOpenSession,
    useCompleteSession,
} from '@/hooks/useSessions';
import SessionDialog from './SessionDialog';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../ui/dialog';
import { useTrainers } from '@/hooks/useTrainer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '@radix-ui/react-label';
import Pagination from '../pagination/Pagination';

interface SessionsTabsProps {
    trainingId?: string;
}

const statusMap: Record<SessionStatus, { label: string; style: string }> = {
    DRAFT: { label: "À l'étude", style: 'bg-orange-100 text-orange-800' },
    NOT_STARTED: { label: 'Programmée', style: 'bg-blue-100 text-blue-800' },
    ACTIVE: { label: 'En cours', style: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Terminée', style: 'bg-gray-100 text-gray-800' },
    CANCELLED: { label: 'Annulée', style: 'bg-red-100 text-red-800' },
};

export default function SessionsTabs({ trainingId }: SessionsTabsProps) {
    const navigate = useNavigate();
    const tid = trainingId ? Number(trainingId) : undefined;
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const [editingSession, setEditingSession] = useState<SessionDetail | null>(null);
    const [createSession, setCreateSession] = useState<SessionDetail | null>(null);
    const [tab, setTab] = useState<'toutes' | 'active' | 'completed' | 'not_started'>('toutes');

    // Confirmation dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [sessionToRun, setSessionToRun] = useState<SessionDetail | null>(null);
    const [sessionToComplete, setSessionToFinish] = useState<SessionDetail | null>(null);
    const [confirmSessionFinishOpen, setConfirmSessionFinishOpen] = useState(false);

    const openSession = useOpenSession();
    const completeSession = useCompleteSession();


    // FILTERS
    const statusFilter = useMemo(() => {
        switch (tab) {
            case 'active':
                return SessionStatus.Active;
            case 'completed':
                return SessionStatus.Completed;
            case 'not_started':
                return SessionStatus.NotStarted;
            default:
                return undefined; // No filtering for "toutes"
        }
    }, [tab]);

    // DATA
    const { data: response, isLoading, isError, error, refetch } =
        useSessions({ trainingId: tid, sessionStatus: statusFilter, page, size: pageSize });
    const { mutate: deleteSession, isLoading: isDeleting } =
        useDeleteSession({ trainingId: tid, page, size: pageSize });
    const updateSession = useUpdateSession({});

    const {
        data: trainers,
        isLoading: isTrainersLoading,
        isError: isTrainersError
    } = useTrainers();

    const busy = isDeleting;
    const sessions = response?.content ?? [];
    const totalPages = response?.totalPages ?? 0;

    const getStatusBadge = (status: SessionDetail['status']) => {
        const cfg = statusMap[status];
        return <Badge className={cfg.style}>{cfg.label}</Badge>;
    };

    // Open the session dialog for create/edit
    const openDialog = (session?: SessionDetail) => {
        setEditingSession(session ?? null);
        setIsDialogOpen(true);
    };

    // Delete handler
    const handleDelete = (id: number) => {
        deleteSession(id, {
            onSuccess: async () => toast({ title: 'Session supprimée' }),
            onError: async () => toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' }),
        });
    };

    // Actual mutation call
    const executeRunSession = (session: SessionDetail) => {
        openSession.mutate(session.id, { onSuccess });
    };

    const executeFinishSession = (session: SessionDetail) => {
        console.log(session)
        completeSession.mutate(session.id, { onSuccess });
    }

    // Trigger to open confirm dialog
    const handlePlayClick = (session: SessionDetail) => {
        setSessionToRun(session);
        setConfirmOpen(true);
    };

    const handleFinishSessionClick = (session: SessionDetail) => {
        setSessionToFinish(session);
        setConfirmSessionFinishOpen(true);
    };

    const onSuccess = () => {
        toast({ title: 'Session lancée' });
        refetch();
    };

    if (isLoading || isTrainersLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>;
    if (isError || isTrainersError) return <div className="p-4 text-center text-red-500">Erreur : {error?.message}</div>;

    // Compute warning for selected session
    const selectedDate = sessionToRun ? new Date(sessionToRun.startDate) : new Date();
    const today = new Date();
    const isToday =
        sessionToRun &&
        selectedDate.getFullYear() === today.getFullYear() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getDate() === today.getDate();
    const warningMessage = sessionToRun && !isToday
        ? `⚠️ La date de la session (${selectedDate.toLocaleDateString()}) n'est pas aujourd'hui.`
        : null;

    const renderTable = (list: SessionDetail[]) => (
        <>
            <Button onClick={() => { setCreateSession(null); setIsDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />Nouvelle Session
            </Button>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Alias</TableHead>
                        <TableHead>Formation</TableHead>
                        <TableHead>Début</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.map(session => (
                        <TableRow
                            key={session.id}
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => navigate(`/sessions/${session.id}`)}
                        >
                            <TableCell>#{session.alias}</TableCell>
                            <TableCell>{session.training.title}</TableCell>
                            <TableCell>{new Date(session.startDate).toLocaleDateString()}</TableCell>
                            <TableCell>{session.endDate && new Date(session.endDate).toLocaleDateString()}</TableCell>
                            <TableCell>{session.location}</TableCell>
                            <TableCell>{getStatusBadge(session.status)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={e => { e.stopPropagation(); handlePlayClick(session); }}
                                        disabled={busy || session.status == SessionStatus.Active || session.status == SessionStatus.Cancelled || session.status == SessionStatus.Completed}
                                    >
                                        <Play className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={e => { e.stopPropagation(); handleFinishSessionClick(session); }}
                                        disabled={busy || session.status == SessionStatus.NotStarted || session.status == SessionStatus.Cancelled || session.status == SessionStatus.Completed}
                                    >
                                        <BookmarkCheck className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={e => { e.stopPropagation(); openDialog(session); }}
                                        disabled={busy}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={e => { e.stopPropagation(); handleDelete(session.id); }}
                                        disabled={busy}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                busy={busy}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
            />
        </>
    );

    return (
        <>
            <SessionDialog
                open={isDialogOpen}
                session={editingSession}
                trainers={trainers.content}
                defaultTrainingId={tid}
                onClose={() => setIsDialogOpen(false)}
            />

            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmer le démarrage de la session</DialogTitle>
                        <DialogDescription>
                            {warningMessage ?? 'Êtes-vous sûr·e de vouloir démarrer cette session ?'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="space-x-2">
                        <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (sessionToRun) executeRunSession(sessionToRun);
                                setConfirmOpen(false);
                            }}
                        >
                            Confirmer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={confirmSessionFinishOpen} onOpenChange={setConfirmSessionFinishOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmer la fin de la session</DialogTitle>
                        <DialogDescription>
                            {warningMessage ?? 'Êtes-vous sûr·e de vouloir clôturer cette session ?'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="space-x-2">
                        <Button variant="secondary" onClick={() => setConfirmSessionFinishOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (sessionToComplete) executeFinishSession(sessionToComplete);
                                setConfirmSessionFinishOpen(false);
                            }}
                        >
                            Confirmer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <Tabs value={tab} onValueChange={(val) => { setTab(val); setPage(0); }} className="w-full">
                <TabsList>
                    <TabsTrigger value="toutes">Toutes</TabsTrigger>
                    <TabsTrigger value="active">Actives</TabsTrigger>
                    <TabsTrigger value="completed">Terminées</TabsTrigger>
                    <TabsTrigger value="not_started">Non commencées</TabsTrigger>
                </TabsList>

                <TabsContent value="toutes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Toutes les sessions</CardTitle>
                        </CardHeader>
                        <CardContent>{renderTable(sessions)}</CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="active">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions actives</CardTitle>
                        </CardHeader>
                        <CardContent>{renderTable(sessions)}</CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="completed">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions terminées</CardTitle>
                        </CardHeader>
                        <CardContent>{renderTable(sessions)}</CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="not_started">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions non commencées</CardTitle>
                        </CardHeader>
                        <CardContent>{renderTable(sessions)}</CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
}
