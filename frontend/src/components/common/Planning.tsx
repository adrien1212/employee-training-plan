import { useEffect, useState } from "react";
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
import { useTodaySessions } from "@/hooks/useSessions";
import { SessionDetail } from "@/types/SessionDetail";
import { useNavigate } from "react-router-dom";


const getStatusColor = (status: SessionDetail['status']) => {
    const colors: Record<SessionDetail['status'], string> = {
        NOT_STARTED: 'bg-blue-100 text-blue-800',
        ACTIVE: 'bg-green-100 text-green-800',
        COMPLETED: 'bg-gray-100 text-gray-800',
        CANCELLED: 'bg-red-100 text-red-800',
        DRAFT: 'bg-red-100 text-red-800'
    };
    return colors[status];
};

const getStatusLabel = (status: SessionDetail['status']) => {
    const labels: Record<SessionDetail['status'], string> = {
        NOT_STARTED: 'Programmée',
        ACTIVE: 'En cours',
        COMPLETED: 'Terminée',
        CANCELLED: 'Annulée',
        DRAFT: "Draft"
    };
    return labels[status];
};

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const todayStr = `${yyyy}-${mm}-${dd}`;

const Planning: React.FC = () => {
    // Utiliser une string pour selectedDate
    const navigate = useNavigate()
    const [selectedDate, setSelectedDate] = useState<string>(todayStr);

    // Récupère les sessions pour la date sélectionnée (au format YYYY-MM-DD)
    const {
        data: sessions,
        isLoading,
        isError,
        refetch
    } = useTodaySessions({ ofDay: selectedDate });

    useEffect(() => {
        // whenever selectedDate updates, force a reload
        refetch();
    }, [selectedDate, refetch]);

    if (isLoading) return <div>Chargement...</div>;
    if (isError) return <div>Erreur lors du chargement des sessions.</div>;

    return (
        <>
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendrier */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5" />
                                Calendrier
                            </CardTitle>
                            <CardDescription>Sélectionnez une date pour voir les formations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    if (!date) return;
                                    setSelectedDate(format(date, 'yyyy-MM-dd'));
                                }}
                                locale={fr}
                                modifiersStyles={{
                                    hasSession: {
                                        backgroundColor: '#dbeafe',
                                        color: '#1e40af',
                                        fontWeight: 'bold',
                                    },
                                }}
                                className="rounded-md border"
                            />
                        </CardContent>
                    </Card>

                    {/* Sessions du jour sélectionné */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                Formations du {format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: fr })}
                            </CardTitle>
                            <CardDescription>{sessions.content.length} formation(s) programmée(s)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sessions.size === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>Aucune formation programmée ce jour</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sessions.content.map((session) => (
                                        <Card
                                            key={session.id}
                                            className="hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => navigate(`/sessions/${session.id}`)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                                        <GraduationCap className="h-4 w-4 text-purple-600" />
                                                        {session.training.title}
                                                    </h3>
                                                    <Badge className={getStatusColor(session.status)}>
                                                        {getStatusLabel(session.status)}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        {session.startDate} - {session.endDate}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        {session.location}
                                                    </div>
                                                    <div className="text-sm">Formateur: {session.trainerId}</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Planning;
