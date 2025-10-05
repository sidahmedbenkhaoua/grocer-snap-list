import { Bell, User, Sun, Moon, Search, Settings, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock notifications
const mockNotifications = [
  { id: 1, message: "Liste 'Course du weekend' complétée", time: "Il y a 2h", unread: true },
  { id: 2, message: "5 nouveaux articles en promotion", time: "Il y a 1j", unread: true },
  { id: 3, message: "Rappel: acheter du pain", time: "Il y a 2j", unread: false },
];

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const unreadCount = mockNotifications.filter(n => n.unread).length;
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || '{"name":"User","email":"user@email.com","avatar":""}');

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt!",
    });
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 dark:bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-xl hover:bg-accent transition-all duration-200 lg:hidden xl:flex"
            asChild
          >
            <SidebarTrigger>
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-fresh-green to-orange-fruit"></div>
            <span className="font-semibold text-foreground">ShoppingApp</span>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-xl hover:bg-accent transition-all duration-200"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative w-9 h-9 rounded-xl hover:bg-accent transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-fruit to-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg">
                    {unreadCount}
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-2xl border shadow-xl bg-popover" align="end">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-popover-foreground">Notifications</h4>
                  {unreadCount > 0 && (
                    <Badge className="bg-gradient-to-r from-orange-fruit to-red-500 text-white border-0">
                      {unreadCount} nouvelles
                    </Badge>
                  )}
                </div>
                <div className="space-y-3">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl transition-all duration-200 hover:bg-accent/50 ${
                        notification.unread 
                          ? 'bg-gradient-to-r from-fresh-green/10 to-orange-fruit/10 border border-fresh-green/20' 
                          : 'bg-muted/50'
                      }`}
                    >
                      <p className="text-sm font-medium text-popover-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-1 rounded-xl hover:bg-accent transition-all duration-200">
                <Avatar className="h-8 w-8 ring-2 ring-border hover:ring-primary/50 transition-all duration-200">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-gradient-to-br from-fresh-green to-orange-fruit text-white font-semibold">
                    {currentUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 rounded-2xl border shadow-xl bg-popover" align="end" forceMount>
              <DropdownMenuLabel className="p-4 font-normal">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-border">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="bg-gradient-to-br from-fresh-green to-orange-fruit text-white font-semibold">
                      {currentUser.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold leading-none text-popover-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="p-3 rounded-xl hover:bg-accent/50 transition-colors">
                <User className="mr-3 h-4 w-4" />
                <span className="font-medium">Mon Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 rounded-xl hover:bg-accent/50 transition-colors">
                <Settings className="mr-3 h-4 w-4" />
                <span className="font-medium">Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 rounded-xl hover:bg-accent/50 transition-colors">
                <Bell className="mr-3 h-4 w-4" />
                <span className="font-medium">Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium"
              >
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}