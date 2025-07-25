import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import EnrollmentsTable from './EnrollmentsTable';
import { SessionStatus } from '@/types/SessionStatus';
import { useSessionsEnrollment } from '@/hooks/useSessionEnrollments';

interface Props {
    trainingId?: number;
    sessionId?: number;
}

const TABS = [
    { key: 'all', label: 'Tous', status: null, showSessionStatus: true },
    { key: 'current', label: 'En cours', status: SessionStatus.Active, showSessionStatus: false },
    { key: 'completed', label: 'Terminé', status: SessionStatus.Completed, showSessionStatus: false },
    { key: 'scheduled', label: 'Programmé', status: SessionStatus.NotStarted, showSessionStatus: false },
] as const;

type TabKey = typeof TABS[number]['key'];

const TrainingSessionEnrollmentTabs: React.FC<Props> = ({ trainingId }) => {
    const [activeTab, setActiveTab] = useState<TabKey>('all');
    const [pageByTab, setPageByTab] = useState<Record<TabKey, number>>({
        all: 0,
        current: 0,
        completed: 0,
        scheduled: 0,
    });

    // Prepare queries for each tab
    const allEnrollments = useSessionsEnrollment({ trainingId, status: null, page: pageByTab.all });
    const currentEnrollments = useSessionsEnrollment({ trainingId, status: SessionStatus.Active, page: pageByTab.current });
    const completedEnrollments = useSessionsEnrollment({ trainingId, status: SessionStatus.Completed, page: pageByTab.completed });
    const scheduledEnrollments = useSessionsEnrollment({ trainingId, status: SessionStatus.NotStarted, page: pageByTab.scheduled });

    const queriesByKey: Record<TabKey, { data?: any; isLoading: boolean }> = {
        all: { data: allEnrollments.data, isLoading: allEnrollments.isLoading },
        current: { data: currentEnrollments.data, isLoading: currentEnrollments.isLoading },
        completed: { data: completedEnrollments.data, isLoading: completedEnrollments.isLoading },
        scheduled: { data: scheduledEnrollments.data, isLoading: scheduledEnrollments.isLoading },
    };

    // If no session selected, prompt user
    if (allEnrollments.isLoading) {
        return <p className="text-center text-gray-500 py-4">Sélectionnez une session pour voir les participants</p>;
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
                {TABS.map(t => (
                    <TabsTrigger key={t.key} value={t.key}>
                        {t.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {TABS.map(tab => {
                const { data, isLoading } = queriesByKey[tab.key];
                return (
                    <TabsContent key={tab.key} value={tab.key}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Participants {tab.label.toLowerCase()}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <EnrollmentsTable
                                    items={data?.content ?? []}
                                    page={pageByTab[tab.key]}
                                    totalPages={data?.totalPages ?? 1}
                                    loading={isLoading}
                                    showSessionStatus={tab.showSessionStatus}
                                    onPageChange={newPage =>
                                        setPageByTab(prev => ({ ...prev, [tab.key]: newPage }))
                                    }
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                );
            })}
        </Tabs>

    );
};

export default TrainingSessionEnrollmentTabs;
