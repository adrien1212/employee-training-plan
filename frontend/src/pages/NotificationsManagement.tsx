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
                        <Tabs defaultValue="rules" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="rules">Règles de notification</TabsTrigger>
                                <TabsTrigger value="history">Historique</TabsTrigger>
                                <TabsTrigger value="templates">Modèles</TabsTrigger>
                                <TabsTrigger value="settings">Paramètres</TabsTrigger>
                            </TabsList>

                            <TabsContent value="rules" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Bell className="h-5 w-5" />
                                                    Règles de notification
                                                </CardTitle>
                                                <CardDescription>Configuration des alertes automatiques</CardDescription>
                                            </div>
                                            <Dialog open={isAddRuleDialogOpen} onOpenChange={setIsAddRuleDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Ajouter une règle
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Nouvelle règle de notification</DialogTitle>
                                                        <DialogDescription>Configurez une nouvelle règle d'alerte automatique</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="ruleName">Nom de la règle *</Label>
                                                            <Input
                                                                id="ruleName"
                                                                value={newRule.name}
                                                                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                                                                placeholder="Ex: Rappel session J-1"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label htmlFor="trigger">Déclencheur</Label>
                                                                <Select value={newRule.trigger} onValueChange={(value: any) => setNewRule({ ...newRule, trigger: value })}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {triggerOptions.map((option) => (
                                                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="type">Type de notification</Label>
                                                                <Select value={newRule.type} onValueChange={(value: any) => setNewRule({ ...newRule, type: value })}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {typeOptions.map((option) => (
                                                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label htmlFor="delay">Délai</Label>
                                                                <Input
                                                                    id="delay"
                                                                    type="number"
                                                                    value={newRule.delay}
                                                                    onChange={(e) => setNewRule({ ...newRule, delay: parseInt(e.target.value) || 0 })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="delayUnit">Unité</Label>
                                                                <Select value={newRule.delayUnit} onValueChange={(value: any) => setNewRule({ ...newRule, delayUnit: value })}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="hours">Heures</SelectItem>
                                                                        <SelectItem value="days">Jours</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="template">Modèle de message *</Label>
                                                            <Textarea
                                                                id="template"
                                                                value={newRule.template}
                                                                onChange={(e) => setNewRule({ ...newRule, template: e.target.value })}
                                                                placeholder="Message avec variables : {{title}}, {{time}}, {{location}}"
                                                                rows={3}
                                                            />
                                                            {/* <p className="text-xs text-gray-500 mt-1">
                                                                Variables disponibles : {{ title }}, {{ time }}, {{ location }}, {{ employeeName }}
                                                            </p> */}
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" onClick={() => setIsAddRuleDialogOpen(false)}>Annuler</Button>
                                                            <Button onClick={addRule}>Ajouter</Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nom</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Déclencheur</TableHead>
                                                    <TableHead>Délai</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {notificationRules.map((rule) => (
                                                    <TableRow key={rule.id}>
                                                        <TableCell className="font-medium">{rule.name}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                {getTypeIcon(rule.type)}
                                                                <span className="capitalize">{rule.type}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {triggerOptions.find(t => t.value === rule.trigger)?.label}
                                                        </TableCell>
                                                        <TableCell>
                                                            {rule.delay} {rule.delayUnit === "hours" ? "heures" : "jours"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={rule.isActive ? "secondary" : "outline"}>
                                                                {rule.isActive ? "Actif" : "Inactif"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Switch
                                                                checked={rule.isActive}
                                                                onCheckedChange={() => toggleRule(rule.id)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="history" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            Historique des notifications
                                        </CardTitle>
                                        <CardDescription>Suivi des alertes envoyées</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Destinataire</TableHead>
                                                    <TableHead>Sujet</TableHead>
                                                    <TableHead>Date d'envoi</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                    <TableHead>Règle</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {notificationHistory.map((notification) => {
                                                    const rule = notificationRules.find(r => r.id === notification.ruleId);
                                                    return (
                                                        <TableRow key={notification.id}>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    {notification.type === "email" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                                                                    <span className="capitalize">{notification.type}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{notification.recipient}</TableCell>
                                                            <TableCell>{notification.subject}</TableCell>
                                                            <TableCell>{notification.sentAt}</TableCell>
                                                            <TableCell>
                                                                <Badge variant={getStatusColor(notification.status)}>
                                                                    {notification.status === "sent" ? "Envoyé" :
                                                                        notification.status === "failed" ? "Échec" : "En attente"}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>{rule?.name}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="templates" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Modèles de messages</CardTitle>
                                        <CardDescription>Templates pré-configurés pour différents types de notifications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="p-4">
                                                <h3 className="font-semibold mb-2">Rappel de session</h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    Bonjour {{ employeeName }}, votre formation "{{ title }}" aura lieu le {{ date }} à {{ time }} en {{ location }}. N'oubliez pas de vous munir des documents requis.
                                                </p>
                                                <Button variant="outline" size="sm">Utiliser ce modèle</Button>
                                            </Card>

                                            <Card className="p-4">
                                                <h3 className="font-semibold mb-2">Candidature en attente</h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    Votre candidature pour la formation "{{ title }}" est en attente de confirmation. Merci de confirmer votre participation avant le {{ deadline }}.
                                                </p>
                                                <Button variant="outline" size="sm">Utiliser ce modèle</Button>
                                            </Card>

                                            <Card className="p-4">
                                                <h3 className="font-semibold mb-2">Session terminée</h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    Merci d'avoir participé à la formation "{{ title }}". N'hésitez pas à laisser votre avis sur cette session.
                                                </p>
                                                <Button variant="outline" size="sm">Utiliser ce modèle</Button>
                                            </Card>

                                            <Card className="p-4">
                                                <h3 className="font-semibold mb-2">Demande de feedback</h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    Votre avis nous intéresse ! Merci d'évaluer la formation "{{ trainingName }}" en cliquant sur le lien suivant : {{ feedbackLink }}
                                                </p>
                                                <Button variant="outline" size="sm">Utiliser ce modèle</Button>
                                            </Card>
                                        </div> */}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="settings" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Paramètres de notification</CardTitle>
                                        <CardDescription>Configuration générale des alertes</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Notifications par email</h3>
                                                <p className="text-sm text-gray-600">Activer l'envoi d'emails automatiques</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Notifications par SMS</h3>
                                                <p className="text-sm text-gray-600">Activer l'envoi de SMS automatiques</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="emailFrom">Adresse email expéditeur</Label>
                                            <Input id="emailFrom" defaultValue="noreply@formationpro.com" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="smsProvider">Fournisseur SMS</Label>
                                            <Select defaultValue="twilio">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="twilio">Twilio</SelectItem>
                                                    <SelectItem value="orange">Orange Business</SelectItem>
                                                    <SelectItem value="ovh">OVH Telecom</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button>
                                            <Send className="h-4 w-4 mr-2" />
                                            Envoyer un test
                                        </Button>
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