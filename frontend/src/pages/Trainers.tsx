import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Users, Plus } from 'lucide-react'
import { AppSidebar } from '@/components/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import TrainerDialog from '@/components/common/TrainerDialog'
import TrainerTable from '@/components/common/TrainerTable'
import { Trainer } from '@/types/Trainer'

const TrainersPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null)

    const openNew = () => {
        setEditingTrainer(null)
        setIsDialogOpen(true)
    }

    const openEdit = (trainer: Trainer) => {
        setEditingTrainer(trainer)
        setIsDialogOpen(true)
    }

    const closeDialog = () => setIsDialogOpen(false)

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <main className="flex-1">
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gestion des Formateurs</h1>
                                <p className="text-gray-600">Formateurs internes et prestataires externes</p>
                            </div>
                        </div>
                    </header>

                    <div className="p-6">
                        <Tabs defaultValue="formateurs" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="formateurs">Formateurs</TabsTrigger>
                                <TabsTrigger value="contrats">Contrats</TabsTrigger>
                                <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
                            </TabsList>

                            <TabsContent value="formateurs" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Users className="h-5 w-5" /> Fiches formateurs
                                                </CardTitle>
                                                <CardDescription>Gestion des profils et compétences</CardDescription>
                                            </div>
                                            <Button onClick={openNew}>
                                                <Plus className="h-4 w-4 mr-2" /> Nouveau Formateur
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <TrainerDialog
                                            open={isDialogOpen}
                                            editingTrainer={editingTrainer}
                                            onClose={closeDialog}
                                        />
                                        <TrainerTable />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}

export default TrainersPage
