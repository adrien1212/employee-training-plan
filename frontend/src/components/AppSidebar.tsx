
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  GraduationCap,
  Calendar,
  Home,
  Settings,
  ChevronDown,
  ChevronRight,
  Euro,
  Pen,
  ChartNoAxesCombined,
  Milestone,
  Bell,
  FileText,
  CreditCard,
  LifeBuoy
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home,
  },
  {
    title: "Planning",
    url: "/planning",
    icon: Calendar,
  },
  {
    title: "Départements",
    url: "/departments",
    icon: Building2,
  },
  {
    title: "Employés",
    url: "/employees",
    icon: Users,
  },
  {
    title: "Formations",
    url: "/trainings",
    icon: GraduationCap,
  },
  {
    title: "Sessions",
    url: "/sessions",
    icon: Milestone,
  },
  {
    title: "Feedbacks",
    url: "/feedbacks",
    icon: Calendar,
  },
  {
    title: "Certificats",
    url: "/certificates",
    icon: Euro,
  },
  {
    title: "Give feedback",
    url: "/give-feedback",
    icon: Pen,
  },
];

const managementItems = [
  {
    title: "Statistiques",
    url: "/statistics",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Notification",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Formateurs",
    url: "/trainers",
    icon: Users,
  },
  {
    title: "Budget",
    url: "/budget",
    icon: Euro,
  },
  {
    title: "Rapports & Exports",
    url: "/reports",
    icon: FileText,
  },
];

const administrationItems = [
  {
    title: "Facturation",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Support",
    url: "/support",
    icon: LifeBuoy,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    const baseClasses = "w-full justify-start transition-colors";
    if (isActive(path)) {
      return `${baseClasses} bg-blue-100 text-blue-700 border-r-2 border-blue-600`;
    }
    return `${baseClasses} hover:bg-gray-100 text-gray-700`;
  };

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          {state !== "collapsed" && (
            <div>
              <h2 className="font-semibold text-gray-900">FormationPro</h2>
              <p className="text-xs text-gray-600">Gestion RH</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavClassName(item.url)}
                      end={item.url === "/"}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {state !== "collapsed" && (
          <SidebarGroup>
            <SidebarGroupLabel>Gestion & Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managementItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {state !== "collapsed" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {administrationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
