import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Mail, PenTool, Play, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { SlotSignature } from "@/types/SlotSignature";
import React from "react";
import { SlotSignatureStatus } from "@/types/SlotSignatureStatus";
import { Badge } from "@/components/ui/badge";
import { usePublicOpenSignature } from "@/hooks/public/usePublicSlotSignature";
import { useTrainerPublicSession, useTrainerPublicSessionEnrollment, useTrainerPublicSlotSignature } from "@/hooks/public/usePublicSessions";
import { useExistSignature } from "@/hooks/useSignatures";


const statusMap: Record<SlotSignatureStatus, { label: string; style: string }> = {
    NOT_STARTED: { label: "Non commencé", style: 'bg-gray-100 text-gray-800' },
    OPEN: { label: 'Ouvert', style: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Complété', style: 'bg-red-100 text-red-800' },
};


const SessionSignature = () => {
    const { trainerAccessToken: trainerAccessToken } = useParams();

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [slotToRun, setSlotToRun] = useState<SlotSignature | null>(null)
    const { mutate: openSignature, isLoading, error: errorOpenSignature } = usePublicOpenSignature()

    const {
        data: session,
        isLoading: sessionLoading,
        isError: sessionError
    } = useTrainerPublicSession(trainerAccessToken)

    const {
        data: sessionsEnrollment,
        isLoading: sessionEnrollmentLoading,
        isError: sessionEnrollmentError,
    } = useTrainerPublicSessionEnrollment(trainerAccessToken)

    const {
        data: slotsSignature,
        isLoading: slotsSignatureLoading,
        isError: slotsSignatureError,
    } = useTrainerPublicSlotSignature(trainerAccessToken)

    const getInitials = (firstName: string, lastName: string) =>
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    const getStatusBadge = (status: SlotSignature['status']) => {
        console.log(status)
        const cfg = statusMap[status];
        return <Badge className={cfg.style}>{cfg.label}</Badge>;
    };

    const handlePlayClick = (slotSignature: SlotSignature) => {
        setSlotToRun(slotSignature)
        setConfirmOpen(true)
    }

    const activeSignature = (slotSignature: SlotSignature | null) => {
        if (slotSignature) openSignature(slotSignature.token)
    }

    if (sessionLoading || sessionEnrollmentLoading || slotsSignatureLoading) return <div>Chargement...</div>;
    if (sessionError || sessionEnrollmentError || slotsSignatureError) return <div>Session non trouvée</div>;

    return (
        <>
            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmer le démarrage</DialogTitle>
                        <DialogDescription>
                            {'Êtes-vous sûr·e de vouloir démarrer le créneau, ceci débloque les signatures ?'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="space-x-2">
                        <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                activeSignature(slotToRun)
                                setConfirmOpen(false)
                            }}
                        >
                            Confirmer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PenTool className="h-6 w-6 text-blue-600" />
                                Formateur - {session.training.name}
                            </CardTitle>
                            <CardDescription>
                                {session.startDate} ↔︎ {session.endDate} • {session.location}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium">{session && sessionsEnrollment.page.number} participants</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Participants Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Liste des participants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Participant</TableHead>
                                        <TableHead>Email</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {session && sessionsEnrollment.content.map(participant => (
                                        <TableRow key={participant.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback className="bg-blue-100 text-blue-700">
                                                            {getInitials(participant.firstName, participant.lastName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-medium">
                                                        {participant.firstName} {participant.lastName}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{participant.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Slot Signature */}
                    {session && slotsSignature.page.size === 0 ? (
                        <div className="text-center py-8 text-gray-500">Aucun créneau trouvé</div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Créneaux à signer</CardTitle>
                                <CardDescription>
                                    Liste des créneaux signés ou à signer par les participants
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Période</TableHead>
                                            <TableHead>Token</TableHead>
                                            <TableHead>Signature activée</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {slotsSignature.content.map(slot => (
                                            <TableRow key={slot.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        {slot.slotDate}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        {slot.periode}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        public/slot/{slot.token}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(slot.status)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                handlePlayClick(slot)
                                                            }}
                                                            className="p-0 h-8 w-8"
                                                        >
                                                            <Play className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
};

export default SessionSignature;