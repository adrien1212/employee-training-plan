import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Euro, TrendingUp, PieChart, Plus, FileText, Award } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface BudgetEnvelope {
    id: number;
    name: string;
    type: "CPF" | "OPCA" | "Plan Formation" | "Interne";
    totalAmount: number;
    usedAmount: number;
    year: number;
}

interface Expense {
    id: number;
    description: string;
    amount: number;
    type: "Interne" | "Prestataire" | "Matériel" | "Déplacement";
    date: string;
    envelopeId: number;
    status: "Prévu" | "Engagé" | "Payé";
}

const BudgetManagement = () => {
    const { toast } = useToast();
    const [budgetEnvelopes, setBudgetEnvelopes] = useState<BudgetEnvelope[]>([
        { id: 1, name: "CPF Collectif", type: "CPF", totalAmount: 50000, usedAmount: 32000, year: 2024 },
        { id: 2, name: "Budget OPCA", type: "OPCA", totalAmount: 75000, usedAmount: 45000, year: 2024 },
        { id: 3, name: "Plan Formation", type: "Plan Formation", totalAmount: 100000, usedAmount: 68000, year: 2024 },
        { id: 4, name: "Formation Interne", type: "Interne", totalAmount: 30000, usedAmount: 12000, year: 2024 },
    ]);

    const [expenses, setExpenses] = useState<Expense[]>([
        { id: 1, description: "Formation Sécurité - Formateur externe", amount: 5000, type: "Prestataire", date: "2024-06-15", envelopeId: 2, status: "Payé" },
        { id: 2, description: "Matériel pédagogique - Sécurité", amount: 1200, type: "Matériel", date: "2024-06-10", envelopeId: 3, status: "Payé" },
        { id: 3, description: "Formation Excel - Interne", amount: 2000, type: "Interne", date: "2024-06-20", envelopeId: 4, status: "Prévu" },
    ]);

    const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
        description: "",
        amount: "",
        type: "",
        envelopeId: "",
        status: "Prévu"
    });

    const expenseTypes = ["Interne", "Prestataire", "Matériel", "Déplacement"];
    const statusOptions = ["Prévu", "Engagé", "Payé"];

    const addExpense = () => {
        if (!newExpense.description || !newExpense.amount || !newExpense.type || !newExpense.envelopeId) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires.",
                variant: "destructive",
            });
            return;
        }

        const expense: Expense = {
            id: expenses.length + 1,
            description: newExpense.description,
            amount: parseFloat(newExpense.amount),
            type: newExpense.type as any,
            date: new Date().toISOString().split('T')[0],
            envelopeId: parseInt(newExpense.envelopeId),
            status: newExpense.status as any,
        };

        setExpenses([...expenses, expense]);
        setNewExpense({ description: "", amount: "", type: "", envelopeId: "", status: "Prévu" });
        setIsAddExpenseDialogOpen(false);

        toast({
            title: "Succès",
            description: "Dépense ajoutée avec succès.",
        });
    };

    const getUsagePercentage = (envelope: BudgetEnvelope) => {
        return (envelope.usedAmount / envelope.totalAmount) * 100;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Prévu": return "default";
            case "Engagé": return "secondary";
            case "Payé": return "outline";
            default: return "default";
        }
    };

    const totalBudget = budgetEnvelopes.reduce((sum, env) => sum + env.totalAmount, 0);
    const totalUsed = budgetEnvelopes.reduce((sum, env) => sum + env.usedAmount, 0);

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <main className="flex-1">
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gestion Budget & Financement</h1>
                                <p className="text-gray-600">Suivi des coûts et enveloppes budgétaires</p>
                            </div>
                        </div>
                    </header>

                    <div className="p-6">
                        {/* Vue d'ensemble */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
                                    <Euro className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalBudget.toLocaleString()} €</div>
                                    <p className="text-xs text-muted-foreground">Toutes enveloppes confondues</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Budget Utilisé</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalUsed.toLocaleString()} €</div>
                                    <p className="text-xs text-muted-foreground">
                                        {((totalUsed / totalBudget) * 100).toFixed(1)}% du budget total
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Budget Restant</CardTitle>
                                    <PieChart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{(totalBudget - totalUsed).toLocaleString()} €</div>
                                    <p className="text-xs text-muted-foreground">Disponible pour nouvelles formations</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Taux d'utilisation</CardTitle>
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{((totalUsed / totalBudget) * 100).toFixed(1)}%</div>
                                    <Progress value={(totalUsed / totalBudget) * 100} className="mt-2" />
                                </CardContent>
                            </Card>
                        </div>

                        <Tabs defaultValue="enveloppes" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="enveloppes">Enveloppes budgétaires</TabsTrigger>
                                <TabsTrigger value="depenses">Dépenses</TabsTrigger>
                                <TabsTrigger value="integration">Intégrations</TabsTrigger>
                                <TabsTrigger value="reporting">Reporting</TabsTrigger>
                            </TabsList>

                            <TabsContent value="enveloppes" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Suivi des enveloppes budgétaires</CardTitle>
                                        <CardDescription>État d'utilisation par source de financement</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {budgetEnvelopes.map((envelope) => (
                                                <div key={envelope.id} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-semibold">{envelope.name}</h3>
                                                            <Badge variant="secondary">{envelope.type}</Badge>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold">
                                                                {envelope.usedAmount.toLocaleString()} € / {envelope.totalAmount.toLocaleString()} €
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {getUsagePercentage(envelope).toFixed(1)}% utilisé
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Progress value={getUsagePercentage(envelope)} className="mt-2" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="depenses" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Gestion des dépenses</CardTitle>
                                                <CardDescription>Suivi des coûts par type et statut</CardDescription>
                                            </div>
                                            <Dialog open={isAddExpenseDialogOpen} onOpenChange={setIsAddExpenseDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Ajouter une dépense
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Nouvelle dépense</DialogTitle>
                                                        <DialogDescription>Enregistrer une nouvelle dépense de formation</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="description">Description *</Label>
                                                            <Input
                                                                id="description"
                                                                value={newExpense.description}
                                                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                                                placeholder="Description de la dépense"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="amount">Montant (€) *</Label>
                                                            <Input
                                                                id="amount"
                                                                type="number"
                                                                value={newExpense.amount}
                                                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                                                placeholder="Montant en euros"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="type">Type de dépense *</Label>
                                                            <Select value={newExpense.type} onValueChange={(value) => setNewExpense({ ...newExpense, type: value })}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionnez un type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {expenseTypes.map((type) => (
                                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="envelope">Enveloppe budgétaire *</Label>
                                                            <Select value={newExpense.envelopeId} onValueChange={(value) => setNewExpense({ ...newExpense, envelopeId: value })}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionnez une enveloppe" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {budgetEnvelopes.map((envelope) => (
                                                                        <SelectItem key={envelope.id} value={envelope.id.toString()}>
                                                                            {envelope.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="status">Statut</Label>
                                                            <Select value={newExpense.status} onValueChange={(value) => setNewExpense({ ...newExpense, status: value })}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {statusOptions.map((status) => (
                                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" onClick={() => setIsAddExpenseDialogOpen(false)}>Annuler</Button>
                                                            <Button onClick={addExpense}>Ajouter</Button>
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
                                                    <TableHead>Description</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Montant</TableHead>
                                                    <TableHead>Enveloppe</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {expenses.map((expense) => {
                                                    const envelope = budgetEnvelopes.find(e => e.id === expense.envelopeId);
                                                    return (
                                                        <TableRow key={expense.id}>
                                                            <TableCell className="font-medium">{expense.description}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">{expense.type}</Badge>
                                                            </TableCell>
                                                            <TableCell>{expense.amount.toLocaleString()} €</TableCell>
                                                            <TableCell>{envelope?.name}</TableCell>
                                                            <TableCell>{expense.date}</TableCell>
                                                            <TableCell>
                                                                <Badge variant={getStatusColor(expense.status)}>{expense.status}</Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="integration" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                Mon Compte Formation
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Synchronisation avec la plateforme Mon Compte Formation pour les formations éligibles CPF.
                                            </p>
                                            <Button variant="outline" className="w-full">
                                                Configurer l'intégration
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Award className="h-5 w-5" />
                                                Datadock / Qualiopi
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Gestion des déclarations et certifications qualité pour les organismes de formation.
                                            </p>
                                            <Button variant="outline" className="w-full">
                                                Gérer les certifications
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5" />
                                                Reporting OPCA
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Export automatique des données pour les déclarations aux organismes collecteurs.
                                            </p>
                                            <Button variant="outline" className="w-full">
                                                Exporter les données
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="reporting" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Rapports financiers</CardTitle>
                                        <CardDescription>Analyse et export des données budgétaires</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                                                <FileText className="h-6 w-6 mb-2" />
                                                Rapport mensuel
                                            </Button>
                                            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                                                <TrendingUp className="h-6 w-6 mb-2" />
                                                Analyse annuelle
                                            </Button>
                                            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                                                <Euro className="h-6 w-6 mb-2" />
                                                Coûts par formation
                                            </Button>
                                            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                                                <PieChart className="h-6 w-6 mb-2" />
                                                Répartition budgétaire
                                            </Button>
                                        </div>
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

export default BudgetManagement;