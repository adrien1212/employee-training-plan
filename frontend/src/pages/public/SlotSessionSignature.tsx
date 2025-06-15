import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueries } from "react-query";
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, PenTool, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePostSignature } from "@/hooks/public/usePublicSignature";
import { usePublicSlotSignature } from "@/hooks/public/usePublicSlotSignature";
import { useSession } from "@/hooks/useSessions";
import { useSessionsEnrollment } from "@/hooks/useSessionEnrollments";
import { useExistSignature } from "@/hooks/useSignatures";
import { SessionEnrollment } from "@/types/SessionEnrollment";

const SlotSessionSignature: React.FC = () => {
    const { slotAccessToken } = useParams<{ slotAccessToken: string }>();
    const { toast } = useToast();

    // State of all participants
    const [participants, setParticipants] = useState<SessionEnrollment[]>([]);

    // API: fetch slot → session → enrollments
    const {
        data: slotSignature,
        isLoading: isSlotLoading,
        isError: isSlotError,
    } = usePublicSlotSignature(slotAccessToken!);

    const {
        data: session,
        isLoading: isSessionLoading,
        isError: isSessionError,
    } = useSession(slotSignature?.sessionId, !!slotSignature?.id);

    const {
        data: sessionEnrollment,
        isLoading: isEnrollmentLoading,
        isError: isEnrollmentError,
    } = useSessionsEnrollment({
        sessionId: slotSignature?.sessionId!,
        enabled: !!session?.id,
    });

    // Initialize participants
    useEffect(() => {
        if (sessionEnrollment?.content) {
            setParticipants(sessionEnrollment.content);
        }
    }, [sessionEnrollment]);

    // For each participant, fire a "does signature exist?" query
    const existQueries = useQueries(
        participants.map((p) => ({
            queryKey: ["existSignature", slotAccessToken, p.sessionEnrollmentToken],
            queryFn: () =>
                useExistSignature
                    .fetcher(slotAccessToken!, p.sessionEnrollmentToken)
                    .then((r) => r.data),
            // keep it disabled until we have both tokens
            enabled: !!slotAccessToken && !!p.sessionEnrollmentToken,
            // don't retry failures here
            retry: false,
        }))
    );

    // Whenever any existQuery returns true, mark that participant as signed
    useEffect(() => {
        existQueries.forEach((q, idx) => {
            if (q.data === true && !participants[idx].hasSigned) {
                setParticipants((prev) =>
                    prev.map((p, i) =>
                        i === idx ? { ...p, hasSigned: true } : p
                    )
                );
                toast({
                    title: "Présence déjà confirmée",
                    description: `Signature détectée pour ${participants[idx].employee.firstName} ${participants[idx].employee.lastName}.`,
                });
            }
        });
    }, [existQueries, participants, toast]);

    // hook to post a new signature
    const { mutate: postSignature, isLoading: postLoading } =
        usePostSignature();

    // UI state for manual signature dialog
    const [selected, setSelected] = useState<SessionEnrollment | null>(null);
    const [signature, setSignature] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSignature = () => {
        if (!selected || !signature.trim()) {
            toast({
                title: "Erreur",
                description: "Veuillez saisir votre signature.",
                variant: "destructive",
            });
            return;
        }

        postSignature(
            {
                slotToken: slotAccessToken!,
                sessionEnrollmentToken: selected.sessionEnrollmentToken,
                signature,
            },
            {
                onSuccess: () => {
                    setParticipants((prev) =>
                        prev.map((p) =>
                            p.id === selected.id ? { ...p, hasSigned: true } : p
                        )
                    );
                    toast({
                        title: "Signature enregistrée",
                        description: `Présence confirmée pour ${selected.employee.firstName} ${selected.employee.lastName}`,
                    });
                },
                onError: () => {
                    toast({
                        title: "Erreur",
                        description: "Impossible d'enregistrer la signature.",
                        variant: "destructive",
                    });
                },
                onSettled: () => {
                    setSignature("");
                    setSelected(null);
                    setDialogOpen(false);
                },
            }
        );
    };

    const openDialog = (p: SessionEnrollment) => {
        setSelected(p);
        setDialogOpen(true);
    };

    const getInitials = (firstName: string, lastName: string) =>
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    const signedCount = participants.filter((p) => p.hasSigned).length;

    if (isSlotLoading || isSessionLoading || isEnrollmentLoading)
        return <div>Chargement…</div>;
    if (isSlotError || isSessionError || isEnrollmentError)
        return <div>Slot non trouvée</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PenTool className="h-6 w-6 text-blue-600" />
                            Feuille de signature – {session!.training.title} –{" "}
                            {slotSignature!.periode}
                        </CardTitle>
                        <CardDescription>
                            {session!.startDate} ↔︎ {session!.endDate} • {session!.location}
                            <br />
                            {slotSignature!.periode}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-gray-600" />
                                <span className="font-medium">
                                    {participants.length} participants
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="font-medium text-green-600">
                                    {signedCount} présences confirmées
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Participants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des participants</CardTitle>
                        <CardDescription>
                            Cliquez sur « Signer » pour confirmer la présence d’un participant
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Participant</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Token</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {participants.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                                        {getInitials(
                                                            p.employee.firstName,
                                                            p.employee.lastName
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">
                                                    {p.employee.firstName} {p.employee.lastName}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{p.employee.email}</TableCell>
                                        <TableCell>
                                            {p.hasSigned ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                                    <span className="text-green-700 font-medium">
                                                        Présent
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-gray-300 rounded-full" />
                                                    <span className="text-gray-500">En attente</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {p.sessionEnrollmentToken}
                                        </TableCell>
                                        <TableCell>
                                            {!p.hasSigned && (
                                                <Button
                                                    onClick={() => openDialog(p)}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <PenTool className="h-4 w-4 mr-2" />
                                                    Signer
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Signature Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Signature de présence</DialogTitle>
                            <DialogDescription>
                                Confirmez la présence de{" "}
                                {selected?.employee.firstName} {selected?.employee.lastName}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="signature">Signature du participant</Label>
                                <Input
                                    id="signature"
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    placeholder="Tapez votre nom pour confirmer votre présence"
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleSignature}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Confirmer
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default SlotSessionSignature;
