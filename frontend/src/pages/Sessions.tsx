
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Users, Table } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SessionDetail } from "@/types/SessionDetail";
import SessionsTabs from "@/components/common/SessionsTabs";
import { SessionStatus } from "@/types/SessionStatus";
import SessionsToday from "@/components/common/SessionsToday";
import Planning from "@/components/common/Planning";

interface Session {
  id: number;
  trainingName: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  maxParticipants: number;
  registeredParticipants: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

const Sessions = () => {
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
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Sessions</h1>
                  <p className="text-gray-600">Planifiez et gérez les sessions de formation</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1  gap-6">
              <Planning />
              <SessionsTabs />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Sessions;
