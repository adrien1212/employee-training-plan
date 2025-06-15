import { AppSidebar } from "@/components/AppSidebar";
import EmployeeDialog from "@/components/common/EmployeeDialog";
import EmployeeTable from "@/components/common/EmployeesTable";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";
import { useDepartments } from "@/hooks/useDepartments";
import api from "@/services/api";
import { Department } from "@/types/Department";
import { Employee } from "@/types/Employee";
import { NewEmployee } from "@/types/NewEmployee";
import { PageResponse } from "@/types/PageResponse";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createEmployee, setCreateEmployee] = useState<Employee | null>(null);

  const {
    data: departments,
    isLoading: isDeptLoading,
    error: deptError,
  } = useDepartments()


  if (isDeptLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
  if (deptError) return <div className="p-4 text-center text-red-500">Erreur de chargement</div>

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Employés</h1>
                <p className="text-gray-600">Gérez les employés de votre organisation</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { setCreateEmployee(null); setIsDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />Nouvel Employé
              </Button>
              <Button onClick={() => navigate('/add-employee-session')}>
                Gestion Employees/Sessions
              </Button>
            </div>
          </header>

          <div className="p-6">
            <EmployeeTable
            />
          </div>

          <EmployeeDialog
            open={isDialogOpen}
            editingEmployee={createEmployee}
            departments={departments.content}
            onClose={() => setIsDialogOpen(false)}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Employees;
