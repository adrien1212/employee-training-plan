
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, Edit, Trash2, Clock, Users, Calendar } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { Training } from "@/types/Training";
import { Department } from "@/types/Department";
import { useNavigate } from "react-router-dom";

const Trainings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [trainings, setTrainings] = useState<Training[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    provider: "",
    departmentIds: [] as number[],
    duration: 0,
    maxParticipants: 0,
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('v1/departments');
        setDepartments(res.data.content);
      } catch {
        // todo
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await api.get('v1/trainings');
        setTrainings(res.data.content);
      } catch {
        // todo
      }
    };

    fetchTrainings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build payload matching your DTO:
    const payload = {
      title: formData.title,
      description: formData.description,
      provider: formData.provider,
      departmentIds: formData.departmentIds
    };

    if (editingTraining) {
      setTrainings(trainings.map(training =>
        training.id === editingTraining.id
          ? { ...training, ...formData }
          : training
      ));
      toast({
        title: "Formation modifiée",
        description: "Les informations de la formation ont été mises à jour avec succès.",
      });
    } else {
      const res = await api.post('v1/trainings', payload);

      const created: Training = res.data;

      console.log(created)
      setTrainings([...trainings, created]);
      toast({
        title: "Formation créée",
        description: "La nouvelle formation a été créée avec succès.",
      });
    }

    setFormData({
      title: "",
      description: "",
      provider: "",
      departmentIds: [],
      duration: 0,
      maxParticipants: 0,
      status: 'active'
    });
    setEditingTraining(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (training: Training) => {
    setEditingTraining(training);
    setFormData({
      title: training.title,
      description: training.description,
      provider: training.provider,
      departmentIds: training.departments.map(d => d.id),
      duration: training.duration,
      maxParticipants: training.maxParticipants,
      status: training.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTrainings(trainings.filter(training => training.id !== id));
    toast({
      title: "Formation supprimée",
      description: "La formation a été supprimée avec succès.",
      variant: "destructive",
    });
  };

  const openCreateDialog = () => {
    setEditingTraining(null);
    setFormData({
      title: "",
      description: "",
      provider: "",
      departmentIds: [],
      duration: 0,
      maxParticipants: 0,
      status: 'active'
    });
    setIsDialogOpen(true);
  };

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
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
                  <p className="text-gray-600">Créez et gérez les formations de votre organisation</p>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Formation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTraining ? "Modifier la formation" : "Créer une nouvelle formation"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTraining
                        ? "Modifiez les informations de la formation ci-dessous."
                        : "Remplissez les informations pour créer une nouvelle formation."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom de la formation</Label>
                      <Input
                        id="name"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Sécurité au travail"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description de la formation..."
                        required
                      />
                    </div>
                    <div>
                      <Label>Dépendances cibles</Label>
                      <div className="space-y-2 mt-1">
                        {departments.map((dept) => (
                          <div key={dept.id} className="flex items-center">
                            <input
                              id={`dept-${dept.id}`}
                              type="checkbox"
                              checked={formData.departmentIds.includes(dept.id)}
                              onChange={(e) => {
                                const newIds = e.target.checked
                                  ? [...formData.departmentIds, dept.id]
                                  : formData.departmentIds.filter((id) => id !== dept.id);
                                setFormData({ ...formData, departmentIds: newIds });
                              }}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <Label htmlFor={`dept-${dept.id}`} className="ml-2 text-gray-700">
                              {dept.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">Durée (heures)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                          placeholder="8"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxParticipants">Max participants</Label>
                        <Input
                          id="maxParticipants"
                          type="number"
                          value={formData.maxParticipants}
                          onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                          placeholder="20"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="status">Statut</Label>
                      <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingTraining ? "Modifier" : "Créer"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainings.map((training) => (
                <Card key={training.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-lg cursor-pointer hover:text-purple-600" onClick={() => navigate(`/trainings/${training.id}`)}>
                          {training.title}
                        </CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(training)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(training.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{training.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-gray-600">Départements</span>
                        <div className="flex flex-wrap gap-1">
                          {training.departments.map((department) => (
                            <Badge key={department.id} variant="outline">
                              {department.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Durée
                        </span>
                        <span className="font-medium">{training.duration}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Max participants
                        </span>
                        <span className="font-medium">{training.maxParticipants}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Sessions
                        </span>
                        <Badge variant="secondary">{training.sessionsCount}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Statut</span>
                        <Badge variant={training.status === 'active' ? 'default' : 'secondary'}>
                          {training.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/trainings/${training.id}`)}
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

export default Trainings;
