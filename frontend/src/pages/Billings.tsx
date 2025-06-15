import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const plans = [
    {
        name: "Starter",
        range: "0-10 employés",
        description: "Gratuit pour les 10 premiers employés.",
        price: 0,
        employees: 10,
        features: [
            "Gestion des formations complète",
            "Accès à toutes les fonctionnalités de base"
        ]
    },
    {
        name: "Essentiel",
        range: "10-100 employés",
        description: "Facturé pour chaque employé supplémentaire.",
        price: 2,
        employees: 100,
        features: [
            "Jusqu'à 100 employés",
            "Support prioritaire",
            "Rapports avancés"
        ]
    },
    {
        name: "Business",
        range: "100-500 employés",
        description: "Pour les entreprises en croissance.",
        price: 1.5,
        employees: 500,
        features: [
            "Jusqu'à 500 employés",
            "Gestion RH avancée",
            "Exports personnalisés"
        ]
    },
    {
        name: "Entreprise",
        range: "500+ employés",
        description: "Prix sur demande, services personnalisés.",
        price: null,
        employees: null,
        features: [
            "Employés illimités",
            "Accompagnement dédié",
            "Fonctionnalités sur-mesure"
        ]
    },
];

const currentEmployees = 17; // TODO: value from backend

const getBestPlan = () => {
    if (currentEmployees <= 10) return 0;
    if (currentEmployees <= 100) return 1;
    if (currentEmployees <= 500) return 2;
    return 3;
};

export default function Billing() {
    const [chosenPlan, setChosenPlan] = useState(getBestPlan());

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <main className="flex-1">
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Facturation & Abonnement</h1>
                                <p className="text-gray-600">Gestion de votre plan et paiements</p>
                            </div>
                        </div>
                    </header>

                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {plans.map((plan, i) => (
                                <Card
                                    key={plan.name}
                                    className={`flex-1 border ${chosenPlan === i
                                        ? "border-blue-600 ring-2 ring-blue-200"
                                        : "border-gray-200"
                                        }`}
                                >
                                    <CardHeader>
                                        <div className="flex flex-row items-center gap-2">
                                            <CardTitle>{plan.name}</CardTitle>
                                            {i === chosenPlan && <Badge color="green">Votre plan</Badge>}
                                        </div>
                                        <div className="text-sm font-medium text-gray-600 mb-1">{plan.range}</div>
                                        <div className="text-xs text-muted-foreground">{plan.description}</div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold mb-2">
                                            {plan.price === 0 && "Gratuit"}
                                            {plan.price && <>{plan.price} €/employé/mois</>}
                                            {plan.price === null && "Sur demande"}
                                        </div>
                                        <ul className="text-sm space-y-1 mb-3">
                                            {plan.features.map((feature, j) => (
                                                <li key={j} className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2">
                                        {i < 3 ? (
                                            <Button
                                                disabled={i === chosenPlan}
                                                variant={i === chosenPlan ? "secondary" : "default"}
                                                onClick={() => setChosenPlan(i)}
                                            >
                                                {i < chosenPlan
                                                    ? "Changer de plan"
                                                    : i === chosenPlan
                                                        ? "Plan actuel"
                                                        : "Passer à ce plan"}
                                            </Button>
                                        ) : (
                                            <Button variant="outline">Contactez-nous</Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        <p className="mt-6 text-sm text-gray-600">
                            <strong>Note :</strong> Vous pouvez gérer votre plan et effectuer vos paiements en ligne. Les paiements sont sécurisés. Facturé uniquement pour les employés actifs dépassant la limite gratuite.
                        </p>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}