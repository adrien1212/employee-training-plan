import React from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { SessionEnrollment } from '@/types/SessionEnrollment'
import { useMissingSignatures } from '@/hooks/useSlotSignature'

interface MissingSignatureProps {
    slotSignatureId: number
    colSpan?: number
}



export default function MissingSignature({ slotSignatureId, colSpan = 6 }: MissingSignatureProps) {
    const { data: missingSignatures, isLoading, error } = useMissingSignatures(slotSignatureId)

    if (isLoading) {
        return (
            <TableRow>
                <TableCell colSpan={colSpan} className="p-4 text-center text-gray-500">
                    Chargement…
                </TableCell>
            </TableRow>
        )
    }

    if (error) {
        return (
            <TableRow>
                <TableCell colSpan={colSpan} className="p-4 text-center text-red-500">
                    Erreur lors du chargement
                </TableCell>
            </TableRow>
        )
    }

    // Placeholder API function for sending emails; implementation pending
    function sendEmail(email: string): void {
        // TODO: integrate with back-end email service
    }

    const entries: SessionEnrollment[] = missingSignatures?.content ?? []

    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="bg-gray-50">
                {entries.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Prénom</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">Demander signature</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.map(enrollment => (
                                <TableRow key={enrollment.employee.id}>
                                    <TableCell>{enrollment.employee.firstName}</TableCell>
                                    <TableCell>{enrollment.employee.lastName}</TableCell>
                                    <TableCell>{enrollment.employee.email}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => sendEmail(enrollment.employee.email)}
                                            className="p-0 h-8 w-8"
                                        >
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="p-4 text-center text-gray-500">Aucun manquant</div>
                )}
            </TableCell>
        </TableRow>
    )
}