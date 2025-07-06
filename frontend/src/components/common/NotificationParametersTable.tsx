import React from 'react';

import { NotificationParameter } from '@/types/NotificationParameter';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useDisableNotificationParameter, useEnableNotificationParameter, useNotificationParameters } from '@/hooks/useNotifications';

export function NotificationParametersTable() {
    const { data, isLoading, error } = useNotificationParameters({ page: 0, size: 10 });
    const enableMutation = useEnableNotificationParameter({ page: 0, size: 10 });
    const disableMutation = useDisableNotificationParameter({ page: 0, size: 10 });

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur : {error.message}</div>;
    }

    const parameters: NotificationParameter[] = data?.content ?? [];

    const toggle = (param: NotificationParameter) => {
        if (param.enabled) {
            disableMutation.mutate(param.id);
        } else {
            enableMutation.mutate(param.id);
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {parameters.map((param) => (
                    <TableRow key={param.id}>
                        <TableCell>{param.name}</TableCell>
                        <TableCell>{param.notificationType}</TableCell>
                        <TableCell>{param.period ? 'J-' + param.period : ""}</TableCell>
                        <TableCell>
                            <Badge variant={param.enabled ? 'secondary' : 'outline'}>
                                {param.enabled ? 'Actif' : 'Inactif'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Switch checked={param.enabled} onCheckedChange={() => toggle(param)} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default NotificationParametersTable;
