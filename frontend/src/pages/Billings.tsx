import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { loadStripe } from '@stripe/stripe-js';
import { SubscribeButton } from "../components/stripe/SubscribeButton";
import PlanCard from "@/components/stripe/PlanCard";
import { isError } from "react-query";
import { useCurrentPlan, usePlans } from "@/hooks/usePlan";
import api from "@/services/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import PrincingStripe from "../components/stripe/PricingPage";




export default function Billing() {

    const {
        data: currentPlan,
        isLoading,
        isError,
    } = useCurrentPlan()

    const {
        data: plans,
        isLoading: isPlanLoading,
        isError: isPlanError
    } = usePlans();


    function openBillingPortal() {
        api.post(`v1/plans/portal`)
    }


    if (isPlanLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (isPlanError) return <div className="p-4 text-center text-red-500">Erreur de chargement</div>

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
                            {plans.content.map((plan, idx) => (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    index={idx}
                                    chosenPlan={plan.id === currentPlan?.id}
                                />
                            ))}
                        </div>
                        <p className="mt-6 text-sm text-gray-600">
                            <strong>Note :</strong> Vous pouvez gérer votre plan et effectuer vos paiements en ligne. Les paiements sont sécurisés. Facturé uniquement pour les employés actifs dépassant la limite gratuite.
                        </p>
                    </div>

                    <Button onClick={() => openBillingPortal()}>Portal</Button>

                    <PrincingStripe />
                </main>
            </div>
        </SidebarProvider>
    );
}
