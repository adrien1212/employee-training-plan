import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, MapPin, Users, Clock, GraduationCap } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { format, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface PlanningSession {
    id: number;
    trainingName: string;
    date: string;
    time: string;
    endTime: string;
    location: string;
    instructor: string;
    participants: number;
    maxParticipants: number;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

const Planning = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSession, setSelectedSession] = useState<PlanningSession | null>(null);

    // Mock data - sessions planifiées
    const sessions: PlanningSession[] = [
        { id: 1, trainingName: "Sécurité au travail", date: "2024-06-15", time: "09:00", endTime: "17:00", location: "Salle A", instructor: "Marie Dubois", participants: 15, maxParticipants: 20, status: 'scheduled' },
        { id: 2, trainingName: "Management d'équipe", date: "2024-06-15", time: "14:00", endTime: "18:00", location: "Salle B", instructor: "Jean Martin", participants: 12, maxParticipants: 12, status: 'scheduled' },
        { id: 3, trainingName: "Formation Excel", date: "2024-06-16", time: "10:00", endTime: "16:00", location: "Salle informatique", instructor: "Sophie Leroy", participants: 14, maxParticipants: 15, status: 'scheduled' },
        { id: 4, trainingName: "Techniques de vente", date: "2024-06-17", time: "13:30", endTime: "17:30", location: "Salle C", instructor: "Pierre Moreau", participants: 8, maxParticipants: 10, status: 'scheduled' },
        { id: 5, trainingName: "Gestion du stress", date: "2024-06-18", time: "09:30", endTime: "12:30", location: "Salle B", instructor: "Marie Dubois", participants: 6, maxParticipants: 8, status: 'scheduled' },
    ];

    const getSessionsForDate = (date: Date) => {
        return sessions.filter(session =>
            isSameDay(parseISO(session.date), date)
        );
    };

    const getDatesWithSessions = () => {
        return sessions.map(session => parseISO(session.date));
    };

    const getStatusColor = (status: PlanningSession['status']) => {
        const colors = {
            scheduled: "bg-blue-100 text-blue-800",
            ongoing: "bg-green-100 text-green-800",
            completed: "bg-gray-100 text-gray-800",
            cancelled: "bg-red-100 text-red-800"
        };
        return colors[status];
    };

    const getStatusLabel = (status: PlanningSession['status']) => {
        const labels = {
            scheduled: "Programmée",
            ongoing: "En cours",
            completed: "Terminée",
            cancelled: "Annulée"
        };
        return labels[status];
    };

    const selectedDateSessions = getSessionsForDate(selectedDate);

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <main className="flex-1">
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Planning Général</h1>
                                <p className="text-gray-600">Vue calendrier globale de toutes les formations</p>
                            </div>
                        </div>
                    </header>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Calendrier */}
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CalendarDays className="h-5 w-5" />
                                        Calendrier
                                    </CardTitle>
                                    <CardDescription>
                                        Sélectionnez une date pour voir les formations
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => date && setSelectedDate(date)}
                                        locale={fr}
                                        modifiers={{
                                            hasSession: getDatesWithSessions()
                                        }}
                                        modifiersStyles={{
                                            hasSession: {
                                                backgroundColor: '#dbeafe',
                                                color: '#1e40af',
                                                fontWeight: 'bold'
                                            }
                                        }}
                                        className="rounded-md border"
                                    />
                                </CardContent>
                            </Card>

                            {/* Sessions du jour sélectionné */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>
                                        Formations du {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                                    </CardTitle>
                                    <CardDescription>
                                        {selectedDateSessions.length} formation(s) programmée(s)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {selectedDateSessions.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>Aucune formation programmée ce jour</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {selectedDateSessions.map((session) => (
                                                <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedSession(session)}>
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                                                <GraduationCap className="h-4 w-4 text-purple-600" />
                                                                {session.trainingName}
                                                            </h3>
                                                            <Badge className={getStatusColor(session.status)}>
                                                                {getStatusLabel(session.status)}
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4" />
                                                                {session.time} - {session.endTime}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4" />
                                                                {session.location}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="h-4 w-4" />
                                                                {session.participants}/{session.maxParticipants} participants
                                                            </div>
                                                            <div className="text-sm">
                                                                Formateur: {session.instructor}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Vue d'ensemble des salles */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Occupation des salles</CardTitle>
                                <CardDescription>Vue d'ensemble de l'utilisation des salles de formation</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {["Salle A", "Salle B", "Salle C", "Salle informatique"].map((salle) => {
                                        const salleSessions = sessions.filter(s => s.location === salle && s.status === 'scheduled');
                                        return (
                                            <Card key={salle} className="p-4">
                                                <h4 className="font-medium mb-2">{salle}</h4>
                                                <div className="text-sm text-gray-600">
                                                    {salleSessions.length} session(s) programmée(s)
                                                </div>
                                                <div className="mt-2 space-y-1">
                                                    {salleSessions.slice(0, 3).map(session => (
                                                        <div key={session.id} className="text-xs bg-blue-50 rounded px-2 py-1">
                                                            {format(parseISO(session.date), 'dd/MM')} - {session.time}
                                                        </div>
                                                    ))}
                                                    {salleSessions.length > 3 && (
                                                        <div className="text-xs text-gray-500">
                                                            +{salleSessions.length - 3} autres...
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Dialog détail session */}
                    <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{selectedSession?.trainingName}</DialogTitle>
                                <DialogDescription>
                                    Détails de la session de formation
                                </DialogDescription>
                            </DialogHeader>
                            {selectedSession && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Date</label>
                                            <p>{format(parseISO(selectedSession.date), 'EEEE d MMMM yyyy', { locale: fr })}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Horaires</label>
                                            <p>{selectedSession.time} - {selectedSession.endTime}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Lieu</label>
                                            <p>{selectedSession.location}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Formateur</label>
                                            <p>{selectedSession.instructor}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Participants</label>
                                            <p>{selectedSession.participants}/{selectedSession.maxParticipants}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Statut</label>
                                            <Badge className={getStatusColor(selectedSession.status)}>
                                                {getStatusLabel(selectedSession.status)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default Planning;