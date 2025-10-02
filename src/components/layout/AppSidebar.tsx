import { useState, useEffect } from "react";
import { ShoppingCart, History, Users, User, Settings, Mail, Crown, UserCircle } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Group } from "@/types/group";

const mainItems = [
  { title: "Ma Liste", url: "/", icon: ShoppingCart },
  { title: "Historique", url: "/history", icon: History },
];

const secondaryItems = [
  { title: "Groupes", url: "/groups", icon: Users },
  { title: "Invitations", url: "/invitations", icon: Mail },
  { title: "Profil", url: "/profile", icon: User },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  useEffect(() => {
    // Charger les groupes de l'utilisateur
    const groups: Group[] = JSON.parse(localStorage.getItem('groups') || '[]');
    setUserGroups(groups);
    
    // Charger le groupe actuel
    const savedGroup = localStorage.getItem('currentGroup');
    if (savedGroup) {
      setCurrentGroup(JSON.parse(savedGroup));
    }
  }, []);

  const isActive = (path: string) => currentPath === path;
  
  // Séparer les groupes par rôle
  const ownedGroups = userGroups.filter(g => g.createdBy === "creator");
  const memberGroups = userGroups.filter(g => g.createdBy !== "creator");

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

        {/* Mes Groupes */}
        {(ownedGroups.length > 0 || memberGroups.length > 0) && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground">
                {state !== "collapsed" && "MES GROUPES"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {/* Groupes dont je suis propriétaire */}
                  {ownedGroups.length > 0 && state !== "collapsed" && (
                    <div className="px-2 py-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Crown className="h-3 w-3" />
                        <span>Propriétaire</span>
                      </div>
                    </div>
                  )}
                  {ownedGroups.map((group) => (
                    <SidebarMenuItem key={group.id}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to="/groups" 
                          className={`rounded-lg transition-all duration-200 ${
                            currentGroup?.id === group.id
                              ? "bg-primary/10 text-primary border border-primary/20" 
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <Crown className="h-4 w-4" />
                          {state !== "collapsed" && (
                            <span className="ml-3 text-sm truncate">{group.name}</span>
                          )}
                          {state !== "collapsed" && currentGroup?.id === group.id && (
                            <Badge variant="default" className="ml-auto text-xs">Actif</Badge>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  {/* Groupes dont je suis membre */}
                  {memberGroups.length > 0 && state !== "collapsed" && (
                    <div className="px-2 py-1 mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <UserCircle className="h-3 w-3" />
                        <span>Membre</span>
                      </div>
                    </div>
                  )}
                  {memberGroups.map((group) => (
                    <SidebarMenuItem key={group.id}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to="/groups" 
                          className={`rounded-lg transition-all duration-200 ${
                            currentGroup?.id === group.id
                              ? "bg-primary/10 text-primary border border-primary/20" 
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <UserCircle className="h-4 w-4" />
                          {state !== "collapsed" && (
                            <span className="ml-3 text-sm truncate">{group.name}</span>
                          )}
                          {state !== "collapsed" && currentGroup?.id === group.id && (
                            <Badge variant="default" className="ml-auto text-xs">Actif</Badge>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <Separator className="my-6" />
          </>
        )}

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