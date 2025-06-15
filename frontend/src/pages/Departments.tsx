import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Plus, Edit, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useDepartments } from "@/hooks/useDepartments";

interface Department {
  id: number;
  name: string;
  description: string;
  manager: string;
  employeeCount: number;
}

const Departments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: ""
  });

  // — READ
  const {
    data: departments,
    isLoading,
    isError,
    error
  } = useDepartments({ page, size: pageSize })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  }

  const openCreateDialog = () => {
    setEditingDepartment(null);
    setFormData({ name: "", description: "", manager: "" });
    setIsDialogOpen(true);
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Département
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingDepartment ? "Modifier le département" : "Créer un nouveau département"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingDepartment
                        ? "Modifiez les informations du département ci-dessous."
                        : "Remplissez les informations pour créer un nouveau département."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom du département</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Ressources Humaines"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description du département..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="manager">Responsable</Label>
                      <Input
                        id="manager"
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                        placeholder="Nom du responsable"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingDepartment ? "Modifier" : "Créer"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.content.map((department) => (
                <Card key={department.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg cursor-pointer hover:text-blue-600" onClick={() => navigate(`/departments/${department.id}`)}>
                          {department.name}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription>{department.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Responsable</span>
                        <span className="font-medium">{department.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Employés</span>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {department.name}
                        </Badge>
                      </div>
                      <div className="pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/departments/${department.id}`)}
                          className="w-full"
                        >
                          Voir les détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Departments;