import { ShoppingCart, History, Users, User, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const mainItems = [
  { title: "Ma Liste", url: "/", icon: ShoppingCart },
  { title: "Historique", url: "/history", icon: History },
];

const secondaryItems = [
  { title: "Groupes", url: "/groups", icon: Users },
  { title: "Profil", url: "/profile", icon: User },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r bg-card">
      <SidebarContent className="p-4">
        {/* Logo */}
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold bg-gradient-fresh bg-clip-text text-transparent">
            {state !== "collapsed" ? "🛒 Mes Courses" : "🛒"}
          </h1>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={`rounded-lg transition-all duration-200 ${
                          active 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${active ? "scale-110" : ""}`} />
                        {state !== "collapsed" && (
                          <span className="ml-3 font-medium">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-6" />

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {secondaryItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={`rounded-lg transition-all duration-200 ${
                          active 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${active ? "scale-110" : ""}`} />
                        {state !== "collapsed" && (
                          <span className="ml-3 font-medium">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}