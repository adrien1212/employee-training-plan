import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Users, CheckCircle2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

interface SignatureRecord {
  employeeId: number;
  date: string;
  hasSigned: boolean;
  signatureTime?: string;
}

const SessionSignatureMatrix = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock session data
  const session = {
    id: Number(id),
    trainingName: "Formation Sécurité au Travail",
    startDate: "2024-06-10",
    endDate: "2024-06-14",
    location: "Salle de formation A",
    instructor: "Dr. Martin Leclerc"
  };

  // Generate training dates (weekdays only)
  const getTrainingDates = () => {
    const dates = [];
    const start = new Date(session.startDate);
    const end = new Date(session.endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const trainingDates = getTrainingDates();

  // Mock employees
  const employees: Employee[] = [
    { id: 1, firstName: "Jean", lastName: "Martin", email: "jean.martin@company.com", department: "Production" },
    { id: 2, firstName: "Marie", lastName: "Dubois", email: "marie.dubois@company.com", department: "RH" },
    { id: 3, firstName: "Pierre", lastName: "Moreau", email: "pierre.moreau@company.com", department: "Marketing" },
    { id: 4, firstName: "Sophie", lastName: "Leroy", email: "sophie.leroy@company.com", department: "Comptabilité" },
    { id: 5, firstName: "Thomas", lastName: "Bernard", email: "thomas.bernard@company.com", department: "Production" },
    { id: 6, firstName: "Julie", lastName: "Petit", email: "julie.petit@company.com", department: "RH" },
  ];

  // Mock signature records
  const [signatures, setSignatures] = useState<SignatureRecord[]>([
    { employeeId: 1, date: "2024-06-10", hasSigned: true, signatureTime: "09:15" },
    { employeeId: 1, date: "2024-06-11", hasSigned: true, signatureTime: "09:10" },
    { employeeId: 1, date: "2024-06-12", hasSigned: false },
    { employeeId: 2, date: "2024-06-10", hasSigned: true, signatureTime: "09:20" },
    { employeeId: 2, date: "2024-06-11", hasSigned: false },
    { employeeId: 3, date: "2024-06-10", hasSigned: true, signatureTime: "09:18" },
    { employeeId: 3, date: "2024-06-11", hasSigned: true, signatureTime: "09:12" },
    { employeeId: 3, date: "2024-06-12", hasSigned: true, signatureTime: "09:08" },
    { employeeId: 4, date: "2024-06-10", hasSigned: false },
    { employeeId: 4, date: "2024-06-11", hasSigned: true, signatureTime: "09:25" },
  ]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const hasSignedOnDate = (employeeId: number, date: string) => {
    return signatures.find(s => s.employeeId === employeeId && s.date === date && s.hasSigned);
  };

  const getSignatureStats = () => {
    const totalPossibleSignatures = employees.length * trainingDates.length;
    const actualSignatures = signatures.filter(s => s.hasSigned).length;
    return {
      total: totalPossibleSignatures,
      signed: actualSignatures,
      percentage: Math.round((actualSignatures / totalPossibleSignatures) * 100)
    };
  };

  const stats = getSignatureStats();

  const toggleSignature = (employeeId: number, date: string) => {
    setSignatures(prev => {
      const existingIndex = prev.findIndex(s => s.employeeId === employeeId && s.date === date);

      if (existingIndex >= 0) {
        // Toggle existing signature
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          hasSigned: !updated[existingIndex].hasSigned,
          signatureTime: !updated[existingIndex].hasSigned ? new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined
        };
        return updated;
      } else {
        // Create new signature
        return [...prev, {
          employeeId,
          date,
          hasSigned: true,
          signatureTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }];
      }
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Button
                variant="ghost"
                onClick={() => navigate('/sessions')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux sessions
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Matrice de signatures</h1>
                <p className="text-gray-600">{session.trainingName}</p>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Informations de la session */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations de la formation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Formation</label>
                    <p className="font-medium">{session.trainingName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Période</label>
                    <p className="font-medium">
                      {formatDate(session.startDate)} - {formatDate(session.endDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Lieu</label>
                    <p className="font-medium">{session.location}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Formateur</label>
                    <p className="font-medium">{session.instructor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {employees.length}
                    </div>
                    <div className="text-sm text-gray-600">Participants</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.signed}
                    </div>
                    <div className="text-sm text-gray-600">Signatures</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.total}
                    </div>
                    <div className="text-sm text-gray-600">Total possible</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.percentage}%
                    </div>
                    <div className="text-sm text-gray-600">Taux de présence</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Matrice de signatures */}
            <Card>
              <CardHeader>
                <CardTitle>Matrice de présence</CardTitle>
                <CardDescription>
                  Cliquez sur les cercles pour marquer/démarquer la présence d'un participant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-max">
                    {/* Header avec les dates */}
                    <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
                      <div className="w-64 text-sm font-medium text-gray-700">
                        Participants
                      </div>
                      {trainingDates.map((date) => (
                        <div key={date} className="w-24 text-center">
                          <div className="text-xs font-medium text-gray-700">
                            {formatDate(date)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Lignes des employés */}
                    <div className="space-y-3">
                      {employees.map((employee) => (
                        <div key={employee.id} className="flex items-center">
                          {/* Informations employé */}
                          <div className="w-64 flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {getInitials(employee.firstName, employee.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {employee.department}
                              </div>
                            </div>
                          </div>

                          {/* Cercles de signature */}
                          {trainingDates.map((date) => {
                            const signed = hasSignedOnDate(employee.id, date);
                            return (
                              <div key={`${employee.id}-${date}`} className="w-24 flex justify-center">
                                <button
                                  onClick={() => toggleSignature(employee.id, date)}
                                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${signed
                                    ? 'bg-green-500 border-green-500 hover:bg-green-600'
                                    : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                                    }`}
                                  title={signed ? `Signé à ${signed.signatureTime}` : 'Non signé - Cliquer pour marquer présent'}
                                >
                                  {signed && (
                                    <CheckCircle2 className="w-4 h-4 text-white mx-auto" />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SessionSignatureMatrix;