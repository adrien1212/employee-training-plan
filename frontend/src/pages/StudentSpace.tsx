import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { SessionStatus } from "@/types/SessionStatus";
import { useParams } from "react-router";
import { usePublicEspaceEtudiant } from "@/hooks/public/usePublicEspaceEtudiant";

// Backend models
interface PublicSessionEnrollmentResponseModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    trainingTitle: string;
    sessionStartDate: string;
    sessionEndDate: string;
    sessionStatus: SessionStatus;
    hasSigned: boolean;
    signatureToken: string;
}

interface PublicEmployeeResponseModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    sessionEnrollments: PublicSessionEnrollmentResponseModel[];
}

// Frontend session type
interface Session {
    id: number;
    trainingName: string;
    date: string;
    time: string;
    sessionStatus: SessionStatus;
    hasSigned: 'signed' | 'pending';
    signatureToken?: string;
}

const StudentSpace = () => {
    const { accessToken } = useParams();

    const { toast } = useToast();
    const [email, setEmail] = useState<string>("");
    const [employeeCode, setEmployeeCode] = useState<string>("");
    const [employee, setEmployee] = useState<PublicEmployeeResponseModel | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [signingId, setSigningId] = useState<number | null>(null);

    // Dialog states
    const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState<boolean>(false);
    const [signature, setSignature] = useState<string>("");
    const [selectedParticipant, setSelectedParticipant] = useState<Session | null>(null);

    const {
        data: espaceEtudiant,
        isLoading: isLoadingEspaceEtudiant,
        isError: isErrorEspaceEtudiant,
    } = usePublicEspaceEtudiant(accessToken)


    const handleSignature = async () => {
        if (!selectedParticipant || !selectedParticipant.signatureToken || !signature.trim()) return;
        setSigningId(selectedParticipant.id);
        try {
            await api(
                `/v1/sessions-enrollments/sign/${selectedParticipant.signatureToken}`,
                {
                    method: 'POST',
                    body: JSON.stringify({ signature }),
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setSessions(prev => prev.map(s => s.id === selectedParticipant.id ? { ...s, hasSigned: 'signed' } : s));
            setIsSignatureDialogOpen(false);
            toast({ title: 'Session signée', description: `Votre signature a été enregistrée pour ${selectedParticipant.trainingName}.` });
        } catch (error: any) {
            console.error(error);
            toast({ title: "Erreur de signature", description: error.response?.data?.message || 'Impossible d\'envoyer la signature.', variant: "destructive" });
        } finally {
            setSigningId(null);
            setSignature("");
        }
    };

    const getInitials = (firstName: string, lastName: string) =>
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    const getStatusBadge = (status: Session['hasSigned']) => {
        const variants = {
            signed: { color: "bg-green-100 text-green-800", label: "Signée" },
            pending: { color: "bg-orange-100 text-orange-800", label: "En attente" }
        };
        const config = variants[status];
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    if (isLoadingEspaceEtudiant) {
        return <div>Chargement ...</div>
    }

    if (isErrorEspaceEtudiant) {
        return <div>Erreur</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                                    {getInitials(espaceEtudiant.employee!.firstName, espaceEtudiant.employee!.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">Bienvenue, {espaceEtudiant.employee!.firstName} {espaceEtudiant.employee!.lastName}</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Mes formations</CardTitle>
                        <CardDescription>Toutes vos sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Formation</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Heure</TableHead>
                                    <TableHead>Session statut</TableHead>
                                    <TableHead>Signé</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessions.map(session => (
                                    <TableRow key={session.id}>
                                        <TableCell>{session.trainingName}</TableCell>
                                        <TableCell><div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-500" />{session.date}</div></TableCell>
                                        <TableCell><div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-500" />{session.time}</div></TableCell>
                                        <TableCell>{session.sessionStatus}</TableCell>
                                        <TableCell>
                                            {session.hasSigned === 'pending' ? (
                                                <div className="flex flex-col space-y-2">
                                                    {getStatusBadge(session.hasSigned)}
                                                    <Button size="sm" onClick={() => { setSelectedParticipant(session); setSignature(''); setIsSignatureDialogOpen(true); }} disabled={signingId === session.id}>
                                                        {signingId === session.id ? 'Signature...' : 'Signer'}
                                                    </Button>
                                                </div>
                                            ) : getStatusBadge(session.hasSigned)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Signature Dialog */}
                <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Signature de présence</DialogTitle>
                            <DialogDescription>
                                Confirmez la présence de {selectedParticipant?.trainingName}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="signature">Signature du participant</Label>
                                <Input
                                    id="signature"
                                    value={signature}
                                    onChange={e => setSignature(e.target.value)}
                                    placeholder="Tapez votre nom pour confirmer votre présence"
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsSignatureDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button onClick={handleSignature} className="bg-blue-600 hover:bg-blue-700">
                                    Confirmer
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setEmail('');
                            setEmployeeCode('');
                            setEmployee(null);
                            setSessions([]);
                        }}
                    >
                        Se déconnecter
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StudentSpace;
