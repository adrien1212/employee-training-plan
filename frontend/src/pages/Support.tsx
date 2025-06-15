import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const faqs = [
    {
        q: "Comment ajouter un nouvel employé ?",
        a: "Rendez-vous dans la section 'Employés' puis cliquez sur 'Ajouter un employé'."
    },
    {
        q: "Comment générer un rapport ?",
        a: "Naviguez vers 'Rapports & exports' et sélectionnez vos filtres, puis exportez en PDF ou Excel."
    },
    {
        q: "Qui contacter en cas de problème de facturation ?",
        a: "Utilisez le formulaire de contact ou envoyez un mail à support@domaine.fr."
    },
];

export default function Support() {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <main className="flex-1">
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Support</h1>
                                <p className="text-gray-600">Aide et assistance</p>
                            </div>
                        </div>
                    </header>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <Card className="mb-4">
                                    <CardHeader>
                                        <CardTitle>FAQ</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-4">
                                            {faqs.map((faq, i) => (
                                                <li key={i}>
                                                    <strong className="text-base">{faq.q}</strong>
                                                    <p className="text-sm text-gray-700">{faq.a}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contactez le support</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form className="space-y-4">
                                            <div>
                                                <label htmlFor="name" className="block font-medium">
                                                    Nom
                                                </label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    className="w-full px-3 py-2 border rounded"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block font-medium">
                                                    Email
                                                </label>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    className="w-full px-3 py-2 border rounded"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="message" className="block font-medium">
                                                    Message
                                                </label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    className="w-full px-3 py-2 border rounded"
                                                    rows={4}
                                                    required
                                                />
                                            </div>
                                            <Button type="submit" className="w-full">
                                                Envoyer
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
