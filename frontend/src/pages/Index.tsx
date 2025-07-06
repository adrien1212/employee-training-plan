
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, GraduationCap, Calendar } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import api from "@/services/api";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { SessionDetail } from "@/types/SessionDetail";
import { useCountEmployees } from "@/hooks/useEmployees";
import { useCountDepartments } from "@/hooks/useDepartments";
import { useCountTrainings } from "@/hooks/useTrainings";
import { useCountSessions } from "@/hooks/useSessions";
import { SessionStatus } from "@/types/SessionStatus";
import { useCurrentPlan } from "@/hooks/usePlan";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  // 1) Set up state to hold the array of stat-objects
  const [recentSessions, setRecentSessions] = useState<SessionDetail[]>([]);

  const {
    data: plan,
    isLoading: isPlanLoading,
    isError: isPlanError
  } = useCurrentPlan()

  const {
    data: employeeNumber,
    isLoading: isEmployeeNumberLoading,
    isError: isEmployeeNumberError
  } = useCountEmployees()

  const {
    data: departmentNumber,
    isLoading: isDepartmentNumberLoading,
    isError: isDepartmentNumberError
  } = useCountDepartments()

  const {
    data: trainingNumber,
    isLoading: isTrainingNumberLoading,
    isError: isTrainingNumberError
  } = useCountTrainings()

  const {
    data: sessionNumber,
    isLoading: isSessionNumberLoading,
    isError: isSessionNumberError
  } = useCountSessions(SessionStatus.NotStarted)

  // 4) The rest of your component stays the same; it just maps over `stats`
  //    (which now comes from the API instead of being hard-coded).
  useEffect(() => {
    const fetchRecentSessions = async () => {
      try {
        const response = await api.get("/v1/sessions?sessionStatus=COMPLETED");
        setRecentSessions(response.data.content);
        console.log(recentSessions)
      } catch {

      }
    };

    fetchRecentSessions();
  }, []);

  if (isEmployeeNumberLoading || isDepartmentNumberLoading || isTrainingNumberLoading || isSessionNumberLoading || isPlanLoading) {
    return <div>Chargement</div>
  }

  if (isEmployeeNumberError || isDepartmentNumberError || isTrainingNumberError || isSessionNumberError || isPlanError) {
    return <div>Error</div>
  }

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
                  <p className="text-gray-600">Tableau de bord principal</p>
                  <Badge className="bg-blue-100 text-blue-800">{plan.name} - {employeeNumber}/{plan.maxEmployees}</Badge>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Statistics Cards (dynamically from `stats`) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Employés
                  </CardTitle>
                  <Users className={`h-5 w-5 text-blue-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{employeeNumber}</div>
                  <p className="text-xs text-gray-500 mt-1">Actifs dans l'entreprise</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Départements
                  </CardTitle>
                  <Building2 className={`h-5 w-5 text-green-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{departmentNumber}</div>
                  <p className="text-xs text-gray-500 mt-1">Départements actifs</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Formations
                  </CardTitle>
                  <GraduationCap className={`h-5 w-5 text-purple-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{trainingNumber}</div>
                  <p className="text-xs text-gray-500 mt-1">Formations disponibles</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Sessions
                  </CardTitle>
                  <Building2 className={`h-5 w-5 text-orange-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{sessionNumber}</div>
                  <p className="text-xs text-gray-500 mt-1">Sessions programmées</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Trainings (unchanged) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Formations Récentes
                </CardTitle>
                <CardDescription>
                  Dernières formations programmées dans votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{session.startDate}</h3>
                        <p className="text-sm text-gray-600">{session.startDate}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{session.startDate}</p>
                        <p className="text-xs text-gray-600">{session.startDate} participants</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Voir toutes les formations
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions (unchanged) */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>
                  Accès rapide aux fonctionnalités principales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                    <Building2 className="h-6 w-6" />
                    Nouveau Département
                  </Button>
                  <Button className="h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                    <Users className="h-6 w-6" />
                    Ajouter Employé
                  </Button>
                  <Button className="h-20 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700">
                    <GraduationCap className="h-6 w-6" />
                    Créer Formation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;