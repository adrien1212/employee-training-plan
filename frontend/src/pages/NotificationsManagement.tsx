import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare, Clock, Users, Plus, Send } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import NotificationParametersTable from "@/components/common/NotificationParametersTable";

interface NotificationRule {
    id: number;
    name: string;
    type: "email" | "sms" | "both";
    trigger: "session_reminder" | "candidature_pending" | "session_completion";
    delay: number;
    delayUnit: "hours" | "days";
    isActive: boolean;
    template: string;
}

interface NotificationHistory {
    id: number;
    type: "email" | "sms";
    recipient: string;
    subject: string;
    sentAt: string;
    status: "sent" | "failed" | "pending";
    ruleId: number;
}

const NotificationsManagement = () => {
    const { toast } = useToast();
    const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
        {
            id: 1,
            name: "Rappel session J-1",
            type: "email",
            trigger: "session_reminder",
            delay: 24,
            delayUnit: "hours",
            isActive: true,
            template: "Rappel : Votre formation {{title}} a lieu demain à {{time}}."
        },
        {
            id: 2,
            name: "Rappel candidature en attente",
            type: "both",
            trigger: "candidature_pending",
            delay: 3,
            delayUnit: "days",
            isActive: true,
            template: "Votre candidature pour {{title}} est en attente. Confirmez votre participation."
        },
    ]);

    const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([
        {
            id: 1,
            type: "email",
            recipient: "jean.martin@company.com",
            subject: "Rappel formation sécurité",
            sentAt: "2024-06-10 14:30",
            status: "sent",
            ruleId: 1
        },
        {
            id: 2,
            type: "sms",
            recipient: "+33123456789",
            subject: "Candidature en attente",
            sentAt: "2024-06-09 10:15",
            status: "sent",
            ruleId: 2
        },
    ]);

    const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = useState(false);
    const [newRule, setNewRule] = useState({
        name: "",
        type: "email" as const,
        trigger: "session_reminder" as const,
        delay: 24,
        delayUnit: "hours" as const,
        template: ""
    });

    const triggerOptions = [
        { value: "session_reminder", label: "Rappel de session" },
        { value: "candidature_pending", label: "Candidature en attente" },
        { value: "session_completion", label: "Session terminée" }
    ];

    const typeOptions = [
        { value: "email", label: "Email uniquement" },
        { value: "sms", label: "SMS uniquement" },
        { value: "both", label: "Email + SMS" }
    ];

    const addRule = () => {
        if (!newRule.name || !newRule.template) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires.",
                variant: "destructive",
            });
            return;
        }

        const rule: NotificationRule = {
            id: notificationRules.length + 1,
            ...newRule,
            isActive: true,
        };

        setNotificationRules([...notificationRules, rule]);
        setNewRule({
            name: "",
            type: "email",
            trigger: "session_reminder",
            delay: 24,
            delayUnit: "hours",
            template: ""
        });
        setIsAddRuleDialogOpen(false);

        toast({
            title: "Succès",
            description: "Règle de notification ajoutée avec succès.",
        });
    };

    const toggleRule = (ruleId: number) => {
        setNotificationRules(notificationRules.map(rule =>
            rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
        ));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "sent": return "secondary";
            case "failed": return "destructive";
            case "pending": return "default";
            default: return "default";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "email": return <Mail className="h-4 w-4" />;
            case "sms": return <MessageSquare className="h-4 w-4" />;
            case "both": return <Bell className="h-4 w-4" />;
            default: return <Bell className="h-4 w-4" />;
        }
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <main className="flex-1">
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications & Rappels</h1>
                                <p className="text-gray-600">Gestion automatisée des alertes et relances</p>
                            </div>
                        </div>
                    </header>

                    <div className="p-6">
                        <Tabs defaultValue="parameters" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="parameters">Paramètres</TabsTrigger>
                                <TabsTrigger value="history">Historique</TabsTrigger>
                            </TabsList>

                            <TabsContent value="parameters">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Bell className="h-5 w-5" />
                                                    Paramètres de notification
                                                </CardTitle>
                                                <CardDescription>Activer / Désactiver les notifications</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <NotificationParametersTable />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="history">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            Historique des notifications
                                        </CardTitle>
                                        <CardDescription>Suivi des alertes envoyées</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Historical component to be implemented */}
                                        <div>À venir...</div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default NotificationsManagement;