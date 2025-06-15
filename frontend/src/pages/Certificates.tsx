import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Plus, Edit, Trash2, AlertTriangle, CheckCircle, Calendar, User } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isAfter, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface Certificate {
  id: number;
  employeeId: number;
  employeeName: string;
  certificateType: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  certificateNumber: string;
}

const Certificates = () => {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([
    { id: 1, employeeId: 1, employeeName: "Jean Martin", certificateType: "CACES R389", issuer: "AFPA", issueDate: "2023-01-15", expiryDate: "2028-01-15", status: 'valid', certificateNumber: "CAC-2023-001" },
    { id: 2, employeeId: 1, employeeName: "Jean Martin", certificateType: "Habilitation électrique B1V", issuer: "APAVE", issueDate: "2022-06-10", expiryDate: "2025-06-10", status: 'expiring', certificateNumber: "HAB-2022-045" },
    { id: 3, employeeId: 2, employeeName: "Marie Dubois", certificateType: "Secourisme SST", issuer: "Croix Rouge", issueDate: "2022-03-20", expiryDate: "2024-03-20", status: 'expired', certificateNumber: "SST-2022-123" },
    { id: 4, employeeId: 3, employeeName: "Sophie Leroy", certificateType: "Certification PMP", issuer: "PMI", issueDate: "2023-09-15", expiryDate: "2026-09-15", status: 'valid', certificateNumber: "PMP-2023-789" },
  ]);

  const employees = [
    { id: 1, name: "Jean Martin" },
    { id: 2, name: "Marie Dubois" },
    { id: 3, name: "Sophie Leroy" },
    { id: 4, name: "Pierre Moreau" },
  ];

  const certificateTypes = [
    "CACES R389", "Habilitation électrique", "Secourisme SST", "Certification PMP",
    "ISO 9001", "HACCP", "Port du masque", "Conduite en sécurité"
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    employeeId: 0,
    certificateType: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    certificateNumber: ""
  });

  // Calculer le statut d'un certificat
  const calculateStatus = (expiryDate: string): Certificate['status'] => {
    const expiry = parseISO(expiryDate);
    const today = new Date();
    const daysUntilExpiry = differenceInDays(expiry, today);

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring';
    return 'valid';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const status = calculateStatus(formData.expiryDate);
    const employeeName = employees.find(emp => emp.id === formData.employeeId)?.name || "";

    if (editingCertificate) {
      setCertificates(certificates.map(cert =>
        cert.id === editingCertificate.id
          ? { ...cert, ...formData, status, employeeName }
          : cert
      ));
      toast({
        title: "Certificat modifié",
        description: "Les informations du certificat ont été mises à jour avec succès.",
      });
    } else {
      const newCertificate: Certificate = {
        id: Math.max(...certificates.map(c => c.id)) + 1,
        ...formData,
        status,
        employeeName
      };
      setCertificates([...certificates, newCertificate]);
      toast({
        title: "Certificat ajouté",
        description: "Le nouveau certificat a été ajouté avec succès.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      employeeId: 0,
      certificateType: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      certificateNumber: ""
    });
    setEditingCertificate(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      employeeId: certificate.employeeId,
      certificateType: certificate.certificateType,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate,
      expiryDate: certificate.expiryDate,
      certificateNumber: certificate.certificateNumber
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
    toast({
      title: "Certificat supprimé",
      description: "Le certificat a été supprimé avec succès.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: Certificate['status']) => {
    const configs = {
      valid: { className: "bg-green-100 text-green-800", icon: CheckCircle, label: "Valide" },
      expiring: { className: "bg-orange-100 text-orange-800", icon: AlertTriangle, label: "Expire bientôt" },
      expired: { className: "bg-red-100 text-red-800", icon: AlertTriangle, label: "Expiré" }
    };

    const config = configs[status];
    return (
      <Badge className={config.className}>
        <config.icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredCertificates = selectedEmployee
    ? certificates.filter(cert => cert.employeeId === selectedEmployee)
    : certificates;

  const stats = {
    total: certificates.length,
    valid: certificates.filter(c => c.status === 'valid').length,
    expiring: certificates.filter(c => c.status === 'expiring').length,
    expired: certificates.filter(c => c.status === 'expired').length
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
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Certificats</h1>
                  <p className="text-gray-600">Suivi des certifications et habilitations des employés</p>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Certificat
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCertificate ? "Modifier le certificat" : "Ajouter un nouveau certificat"}
                    </DialogTitle>
                    <DialogDescription>
                      Remplissez les informations du certificat ci-dessous.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="employeeId">Employé</Label>
                      <Select value={formData.employeeId.toString()} onValueChange={(value) => setFormData({ ...formData, employeeId: parseInt(value) })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un employé" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id.toString()}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="certificateType">Type de certificat</Label>
                      <Select value={formData.certificateType} onValueChange={(value) => setFormData({ ...formData, certificateType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {certificateTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="issuer">Organisme délivrant</Label>
                      <Input
                        id="issuer"
                        value={formData.issuer}
                        onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                        placeholder="Ex: AFPA, APAVE, Croix Rouge..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="issueDate">Date de délivrance</Label>
                        <Input
                          id="issueDate"
                          type="date"
                          value={formData.issueDate}
                          onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Date d'expiration</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="certificateNumber">Numéro de certificat</Label>
                      <Input
                        id="certificateNumber"
                        value={formData.certificateNumber}
                        onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                        placeholder="Ex: CAC-2023-001"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingCertificate ? "Modifier" : "Ajouter"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Valides</p>
                      <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Expire bientôt</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.expiring}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Expirés</p>
                      <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="employee-filter">Filtrer par employé</Label>
                    <Select value={selectedEmployee?.toString() || ""} onValueChange={(value) => setSelectedEmployee(value ? parseInt(value) : null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les employés" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les employés</SelectItem>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des certificats */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des certificats</CardTitle>
                <CardDescription>
                  {filteredCertificates.length} certificat(s) trouvé(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Type de certificat</TableHead>
                      <TableHead>Organisme</TableHead>
                      <TableHead>Date de délivrance</TableHead>
                      <TableHead>Date d'expiration</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.map((certificate) => (
                      <TableRow key={certificate.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            {certificate.employeeName}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{certificate.certificateType}</TableCell>
                        <TableCell>{certificate.issuer}</TableCell>
                        <TableCell>{format(parseISO(certificate.issueDate), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{format(parseISO(certificate.expiryDate), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(certificate.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(certificate)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(certificate.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Certificates;