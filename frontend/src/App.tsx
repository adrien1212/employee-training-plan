
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import Trainings from "./pages/Trainings";
import Sessions from "./pages/Sessions";
import NotFound from "./pages/NotFound";
import PrivateRoutes from "./services/PrivateRoute";
import TrainingDetail from "./pages/TrainingDetail";
import DepartmentDetail from "./pages/DepartmentDetail";
import Statistics from "./pages/Statistics";
import Feedbacks from "./pages/Feedbacks";
import GiveFeedback from "./pages/GiveFeedback";
import EmployeeDetail from "./pages/EmployeeDetail";
import AddEmployeeToSession from "./pages/AddEmployeeToSession";
import SessionDetailPage from "./pages/SessionDetailPage";
import SessionSignature from "./pages/public/SessionSignature";
import TrainerSpace from "./pages/TrainerSpace";
import StudentSpace from "./pages/StudentSpace";
import TrainersManagement from "./pages/Trainers";
import Trainers from "./pages/Trainers";
import BudgetManagement from "./pages/BudgetManagement";
import NotificationsManagement from "./pages/NotificationsManagement";
import TrainerDetail from "./pages/TrainerDetail";
import Planning from "./pages/Planning";
import Certificates from "./pages/Certificates";
import Reports from "./pages/Reports";
import Billing from "./pages/Billings";
import Support from "./pages/Support";
import SlotSessionSignature from "./pages/public/SlotSessionSignature";
import SessionSignatureMatrix from "./pages/SessionSignatureMatrix";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />

          {/* Public Routes */}

          {/* Private Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Index />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/:id" element={<DepartmentDetail />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/trainers/:id" element={<TrainerDetail />} />
            <Route path="/add-employee-session" element={<AddEmployeeToSession />} />
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/trainings/:id" element={<TrainingDetail />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/sessions/:id" element={<SessionDetailPage />} />
            <Route path="/feedbacks" element={<Feedbacks />} />
            <Route path="/notifications" element={<NotificationsManagement />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/budget" element={<BudgetManagement />} />
            <Route path="/give-feedback" element={<GiveFeedback />} />
            <Route path="/espace-formateur/:trainingAccessToken" element={<TrainerSpace />} />
            <Route path="/espace-etudiants" element={<StudentSpace />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/support" element={<Support />} />
            <Route path="/signatures" element={<SessionSignatureMatrix />} />


            <Route path="/public/signature/:trainerAccessToken" element={<SessionSignature />} />
            <Route path="/public/slot/:slotAccessToken" element={<SlotSessionSignature />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
