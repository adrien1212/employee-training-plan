import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Edit, Trash2, Clock, Users, Calendar } from "lucide-react";
import { Training } from "@/types/Training";
import { useDepartments } from "@/hooks/useDepartments";
import { useSessions } from "@/hooks/useSessions";
import { SessionStatus } from "@/types/SessionStatus";
import { SessionDetail } from "@/types/SessionDetail";


interface TrainingCardProps {
    training: Training;
    onEdit: (t: Training) => void;
    onDelete: (id: number) => void;
    onView: (id: number) => void;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({ training, onEdit, onDelete, onView }) => {
    // Fetch departments for this training
    const { data: deptPage, isLoading: deptLoading, isError: deptError } = useDepartments({ trainingId: training.id });
    const departments = deptPage?.content ?? [];

    // Fetch active sessions (en cours)
    const { data: activePage } = useSessions({ trainingId: training.id, sessionStatus: SessionStatus.Active });
    const activeSessions: SessionDetail[] = activePage?.content ?? [];

    // Fetch scheduled sessions (planifiée)
    const { data: scheduledPage } = useSessions({ trainingId: training.id, sessionStatus: SessionStatus.NotStarted });
    const scheduledSessions: SessionDetail[] = scheduledPage?.content ?? [];

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        <CardTitle
                            className="text-lg cursor-pointer hover:text-purple-600"
                            onClick={() => onView(training.id)}
                        >
                            {training.title}
                        </CardTitle>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(training)} className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(training.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <CardDescription>{training.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {/* Departments */}
                    <div className="flex items-start justify-between">
                        <span className="text-sm text-gray-600">Départements</span>
                        <div className="flex flex-wrap gap-1">
                            {deptLoading && <span>Chargement...</span>}
                            {deptError && <span className="text-red-500">Erreur de chargement</span>}
                            {!deptLoading && !deptError && departments.map((dept) => (
                                <Badge key={dept.id} variant="outline">
                                    {dept.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Durée
                        </span>
                        <span className="font-medium">{training.duration}h</span>
                    </div>

                    {/* Max Participants */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Users className="h-3 w-3" /> Max participants
                        </span>
                        <span className="font-medium">{training.maxParticipants}</span>
                    </div>

                    {/* Sessions List */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sessions en cours</span>
                        <span className="font-medium">{activeSessions.length}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sessions planifiées</span>
                        <span className="font-medium">{scheduledSessions.length}</span>
                    </div>

                    {/* View Details Button */}
                    <div className="pt-3">
                        <Button variant="outline" size="sm" onClick={() => onView(training.id)} className="w-full">
                            Voir les détails
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};