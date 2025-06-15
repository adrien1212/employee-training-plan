import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, GraduationCap, Star } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Statistics = () => {
  // Données pour le graphique des sessions par mois
  const sessionsPerMonth = [
    { month: "Jan", sessions: 12 },
    { month: "Fév", sessions: 15 },
    { month: "Mar", sessions: 18 },
    { month: "Avr", sessions: 22 },
    { month: "Mai", sessions: 20 },
    { month: "Juin", sessions: 25 },
  ];

  // Données pour les formations par employé
  const trainingsPerEmployee = [
    { department: "Production", average: 3.2 },
    { department: "IT", average: 4.1 },
    { department: "RH", average: 2.8 },
    { department: "Commercial", average: 3.5 },
    { department: "Direction", average: 2.1 },
  ];

  // Données pour les notes moyennes des dernières sessions
  const recentSessionsRatings = [
    { session: "Sécurité", rating: 4.2, participants: 20 },
    { session: "Excel", rating: 4.7, participants: 15 },
    { session: "Management", rating: 3.8, participants: 12 },
    { session: "Communication", rating: 4.5, participants: 18 },
    { session: "Gestion stress", rating: 4.1, participants: 10 },
  ];

  // Données pour la répartition des statuts de sessions
  const sessionStatusData = [
    { name: "Terminées", value: 45, color: "#10B981" },
    { name: "Programmées", value: 12, color: "#3B82F6" },
    { name: "En cours", value: 3, color: "#F59E0B" },
    { name: "Annulées", value: 2, color: "#EF4444" },
  ];

  const totalSessions = sessionsPerMonth.reduce((acc, month) => acc + month.sessions, 0);
  const totalEmployees = 145;
  const averageTrainingPerEmployee = (trainingsPerEmployee.reduce((acc, dept) => acc + dept.average, 0) / trainingsPerEmployee.length).toFixed(1);
  const overallAverageRating = (recentSessionsRatings.reduce((acc, session) => acc + session.rating, 0) / recentSessionsRatings.length).toFixed(1);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
                <p className="text-gray-600">Tableau de bord des formations et performances</p>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* KPIs principaux */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
                      <div className="text-sm text-gray-600">Sessions totales</div>
                    </div>
                    <GraduationCap className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{totalEmployees}</div>
                      <div className="text-sm text-gray-600">Employés formés</div>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{averageTrainingPerEmployee}</div>
                      <div className="text-sm text-gray-600">Formations/employé</div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{overallAverageRating}</div>
                      <div className="text-sm text-gray-600">Note moyenne</div>
                    </div>
                    <Star className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sessions par mois */}
              <Card>
                <CardHeader>
                  <CardTitle>Sessions par mois</CardTitle>
                  <CardDescription>Évolution du nombre de sessions organisées</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sessionsPerMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Répartition des statuts de sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des sessions</CardTitle>
                  <CardDescription>Statut actuel de toutes les sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sessionStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sessionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Formations par employé par département */}
              <Card>
                <CardHeader>
                  <CardTitle>Formations moyennes par département</CardTitle>
                  <CardDescription>Nombre moyen de formations par employé</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trainingsPerEmployee} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="department" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Notes moyennes des dernières sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes des dernières sessions</CardTitle>
                  <CardDescription>Évaluations moyennes des sessions récentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={recentSessionsRatings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="session" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'rating' ? `${value}/5` : value,
                          name === 'rating' ? 'Note' : 'Participants'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rating" 
                        stroke="#F59E0B" 
                        strokeWidth={3}
                        dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tableau détaillé des dernières sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Détail des dernières sessions</CardTitle>
                <CardDescription>Performance détaillée des sessions récentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Session</th>
                        <th className="text-left py-2">Note moyenne</th>
                        <th className="text-left py-2">Participants</th>
                        <th className="text-left py-2">Taux de satisfaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSessionsRatings.map((session, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 font-medium">{session.session}</td>
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <span>{session.rating}/5</span>
                              <div className="flex text-yellow-500">
                                {"★".repeat(Math.round(session.rating))}
                                {"☆".repeat(5 - Math.round(session.rating))}
                              </div>
                            </div>
                          </td>
                          <td className="py-2">{session.participants}</td>
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${(session.rating / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">
                                {Math.round((session.rating / 5) * 100)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Statistics;