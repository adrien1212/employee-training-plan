import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";
import { useDepartments } from "@/hooks/useDepartments";
import { DepartmentFormDialog } from '@/components/common/DepartmentFormDialog';
import { DepartmentCard } from '@/components/common/DepartmentCard';
import { Department } from '@/types/Department';

const Departments: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error } = useDepartments({ page, size: pageSize });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const handleSubmit = (data: Omit<Department, 'id' | 'employeeCount'>) => {
    if (editingDept) {
      // TODO: call update API
      toast({ title: 'Département modifié.', description: 'Les informations ont été mises à jour.' });
    } else {



      toast({ title: 'Département créé.', description: 'Le nouveau département a été ajouté.' });
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>;
  if (isError) return <div className="p-4 text-center text-red-500">Erreur : {error?.message}</div>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Départements</h1>
                  <p className="text-gray-600">Gérez les départements de votre organisation</p>
                </div>
              </div>
              <div>
                <DepartmentFormDialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </header>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.content.map((dept) => (
                <DepartmentCard key={dept.id}
                  department={dept} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Departments;