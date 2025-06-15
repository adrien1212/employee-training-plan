import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { CheckCircle2 } from 'lucide-react';

/**
 * Component to render the signature matrix as a dot matrix for a given session.
 *
 * Props:
 *   - sessionId: ID of the session to display
 */
export default function DotMatrix({ sessionId }) {
    const [slots, setSlots] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [signedSet, setSignedSet] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        // Parallel fetch: enrollments, slots, signatures
        Promise.all([
            api.get(`/v1/sessions-enrollment?sessionId=${sessionId}`),
            api.get(`/v1/slots-signature?sessionId=${sessionId}`),
            api.get(`/v1/signatures?sessionId=${sessionId}`),
        ])
            .then(([enRes, slotRes, sigRes]) => {
                const enrollData = enRes.data.content;
                const slotData = slotRes.data.content;
                const sigData = sigRes.data.content;

                setEnrollments(enrollData);
                setSlots(slotData);
                // Build lookup set for signed pairs
                const setKeys = new Set(sigData.map((s) => `${s.slotSignatureId}#${s.sessionEnrollmentId}`));
                setSignedSet(setKeys);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load signature matrix');
                setLoading(false);
            });
    }, [sessionId]);

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const formatSlotDisplay = (slot) => {
        return `${slot.slotDate} (${slot.periode})`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!slots.length || !enrollments.length) return <div>No data available</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Matrice de signatures</CardTitle>
                <CardDescription>
                    Statut des signatures pour chaque employé et créneau horaire
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <div className="min-w-max">
                        {/* Header avec les créneaux */}
                        <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
                            <div className="w-64 text-sm font-medium text-gray-700">
                                Employés
                            </div>
                            {slots.map((slot) => (
                                <div key={slot.id} className="w-24 text-center">
                                    <div className="text-xs font-medium text-gray-700">
                                        {formatSlotDisplay(slot)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Lignes des employés */}
                        <div className="space-y-3">
                            {enrollments.map((enrollment) => (
                                <div key={enrollment.id} className="flex items-center">
                                    {/* Informations employé */}
                                    <div className="w-64 flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                                {getInitials(enrollment.employee.firstName, enrollment.employee.lastName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {enrollment.employee.firstName} {enrollment.employee.lastName}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {enrollment.employee.department?.name || 'Aucun département'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cercles de signature */}
                                    {slots.map((slot) => {
                                        const key = `${slot.id}#${enrollment.id}`;
                                        const signed = signedSet.has(key);
                                        return (
                                            <div key={key} className="w-24 flex justify-center">
                                                <div
                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${signed
                                                            ? 'bg-green-500 border-green-500'
                                                            : 'bg-gray-200 border-gray-300'
                                                        }`}
                                                    title={signed ? 'Signé' : 'Non signé'}
                                                >
                                                    {signed && (
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}