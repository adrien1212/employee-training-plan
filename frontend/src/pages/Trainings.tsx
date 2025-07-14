import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import api from "@/services/api";
import { Training } from "@/types/Training";
import { Department } from "@/types/Department";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { TrainingFormDialog } from "@/components/common/TrainingFormDialog";
import { TrainingCard } from "@/components/common/TrainingCard";


const Trainings: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);

  useEffect(() => {
    api.get("v1/departments").then((res) => setDepartments(res.data.content));
    api.get("v1/trainings").then((res) => setTrainings(res.data.content));
  }, []);

  const handleSubmit = async (data: Partial<Training>) => {
    if (editingTraining) {
      setTrainings((prev) =>
        prev.map((t) => (t.id === editingTraining.id ? { ...t, ...data } : t))
      );
      toast({ title: "Formation modifiée", description: "Les informations ont été mises à jour." });
    } else {
      const res = await api.post("v1/trainings", data);
      setTrainings((prev) => [...prev, res.data]);
      toast({ title: "Formation créée", description: "Nouvelle formation ajoutée." });
    }
    setEditingTraining(null);
  };

  const handleEdit = (training: Training) => {
    setEditingTraining(training);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTrainings((prev) => prev.filter((t) => t.id !== id));
    toast({ title: "Formation supprimée", description: "La formation a été supprimée.", variant: "destructive" });
  };

  const handleView = (id: number) => navigate(`/trainings/${id}`);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
                <p className="text-gray-600">Créez et gérez les formations de votre organisation</p>
              </div>
            </div>
            <TrainingFormDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              departments={departments}
              editingTraining={editingTraining}
              onSubmit={handleSubmit}
            />
          </header>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainings.map((t) => (
              <TrainingCard
                key={t.id}
                training={t}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Trainings;
