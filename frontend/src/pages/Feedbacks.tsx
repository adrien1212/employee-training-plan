import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Star } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import FeedbackTabs from "@/components/common/FeedbackTabs";
import PendingFeedback from "@/components/common/FeedbackPending";

interface FeedbackItem {
  id: number;
  sessionId: number;
  sessionName: string;
  sessionDate: string;
  participantName: string;
  participantEmail: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

interface PendingFeedback {
  id: number;
  sessionId: number;
  sessionName: string;
  sessionDate: string;
  participantName: string;
  participantEmail: string;
  department: string;
  completedAt: string;
}

const Feedbacks = () => {
  const { toast } = useToast();

  const feedbacks: FeedbackItem[] = [
    {
      id: 1,
      sessionId: 1,
      sessionName: "Sécurité au travail",
      sessionDate: "2024-06-15",
      participantName: "Jean Martin",
      participantEmail: "jean.martin@company.com",
      rating: 4,
      comment: "Formation très utile, les exemples concrets sont appréciables. Le formateur était compétent.",
      submittedAt: "2024-06-15 17:30"
    },
    {
      id: 2,
      sessionId: 1,
      sessionName: "Sécurité au travail",
      sessionDate: "2024-06-15",
      participantName: "Paul Durand",
      participantEmail: "paul.durand@company.com",
      rating: 5,
      comment: "Excellente formation ! J'ai beaucoup appris sur les nouvelles procédures de sécurité.",
      submittedAt: "2024-06-15 18:00"
    },
    {
      id: 3,
      sessionId: 2,
      sessionName: "Formation Excel",
      sessionDate: "2024-06-10",
      participantName: "Sophie Leroy",
      participantEmail: "sophie.leroy@company.com",
      rating: 5,
      comment: "Formation excellente, très pratique et bien organisée.",
      submittedAt: "2024-06-10 16:45"
    },
    {
      id: 4,
      sessionId: 2,
      sessionName: "Formation Excel",
      sessionDate: "2024-06-10",
      participantName: "Marie Dubois",
      participantEmail: "marie.dubois@company.com",
      rating: 3,
      comment: "Formation correcte mais trop rapide pour les débutants.",
      submittedAt: "2024-06-11 09:20"
    }
  ];

  const pendingFeedbacks: PendingFeedback[] = [
    {
      id: 1,
      sessionId: 1,
      sessionName: "Sécurité au travail",
      sessionDate: "2024-06-15",
      participantName: "Pierre Moreau",
      participantEmail: "pierre.moreau@company.com",
      department: "Commercial",
      completedAt: "2024-06-15 16:00"
    },
    {
      id: 2,
      sessionId: 3,
      sessionName: "Management d'équipe",
      sessionDate: "2024-06-12",
      participantName: "Julie Bernard",
      participantEmail: "julie.bernard@company.com",
      department: "Production",
      completedAt: "2024-06-12 17:30"
    },
    {
      id: 3,
      sessionId: 3,
      sessionName: "Management d'équipe",
      sessionDate: "2024-06-12",
      participantName: "Marc Petit",
      participantEmail: "marc.petit@company.com",
      department: "IT",
      completedAt: "2024-06-12 17:30"
    }
  ];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0)).join('').toUpperCase();
  };

  const sendReminder = (participantEmail: string, participantName: string) => {
    // Ici vous implémenteriez l'envoi de l'email de relance
    toast({
      title: "Relance envoyée",
      description: `Un email de relance a été envoyé à ${participantName} (${participantEmail})`,
    });
  };

  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '-';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Avis</h1>
                <p className="text-gray-600">Consultez et gérez les retours des participants</p>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{feedbacks.length}</div>
                    <div className="text-sm text-gray-600">Avis reçus</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{pendingFeedbacks.length}</div>
                    <div className="text-sm text-gray-600">Avis en attente</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{averageRating}</div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="received" className="space-y-4">
              <TabsList>
                <TabsTrigger value="received" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Avis reçus
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Avis en attente
                </TabsTrigger>
              </TabsList>

              <TabsContent value="received">
                <FeedbackTabs pageSize={20} />
              </TabsContent>

              <TabsContent value="pending">
                <PendingFeedback pageSize={20} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Feedbacks;