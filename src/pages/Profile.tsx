import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, ShoppingCart, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock user data
const mockUser = {
  name: "Marie Dubois",
  email: "marie.dubois@email.com",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b560?w=150&h=150&fit=crop&crop=face",
  joinDate: "2023-10-15",
  stats: {
    totalLists: 25,
    completedLists: 22,
    totalItems: 156,
    averageItems: 6.2
  }
};

export default function Profile() {
  const isMobile = useIsMobile();
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const completionRate = Math.round((mockUser.stats.completedLists / mockUser.stats.totalLists) * 100);

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Mon Profil</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Gérez vos informations personnelles et consultez vos statistiques
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {/* Profile Info */}
        <div className="md:col-span-2">
          <Card className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 mb-6">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 mx-auto sm:mx-0">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="text-base md:text-lg">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-xl md:text-2xl font-bold">{mockUser.name}</h2>
                <p className="text-sm md:text-base text-muted-foreground truncate">{mockUser.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Membre depuis le {formatDate(mockUser.joinDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold">Informations personnelles</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Nom complet</Label>
                  <Input id="name" value={mockUser.name} readOnly className="text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input id="email" type="email" value={mockUser.email} readOnly className="text-sm" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button className="bg-fresh-green hover:bg-fresh-green/90 w-full sm:w-auto" size={isMobile ? "sm" : "default"}>
                  Modifier le profil
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" size={isMobile ? "sm" : "default"}>
                  Changer le mot de passe
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:gap-4">
          <Card className="p-3 md:p-4 col-span-3 md:col-span-1">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-fresh-green">{completionRate}%</div>
              <div className="text-xs md:text-sm text-muted-foreground">Taux de completion</div>
            </div>
          </Card>

          <Card className="p-3 md:p-4 col-span-3 md:col-span-1">
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-2">
                  <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-fresh-green flex-shrink-0" />
                  <span className="text-xs md:text-sm">Listes créées</span>
                </div>
                <Badge variant="secondary" className="text-xs">{mockUser.stats.totalLists}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-2">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-orange-fruit flex-shrink-0" />
                  <span className="text-xs md:text-sm">Articles total</span>
                </div>
                <Badge variant="secondary" className="text-xs">{mockUser.stats.totalItems}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-2">
                  <User className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
                  <span className="text-xs md:text-sm">Moyenne/liste</span>
                </div>
                <Badge variant="secondary" className="text-xs">{mockUser.stats.averageItems}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Activité récente</h3>
        <div className="space-y-2 md:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 p-3 bg-fresh-green-light/20 rounded-lg">
            <span className="text-xs md:text-sm">Liste "Course du weekend" terminée</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">Il y a 2 heures</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 p-3 bg-orange-fruit-light/20 rounded-lg">
            <span className="text-xs md:text-sm">Nouvelle liste "Courses de la semaine" créée</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">Il y a 1 jour</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 p-3 bg-secondary rounded-lg">
            <span className="text-xs md:text-sm">Profil mis à jour</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">Il y a 3 jours</span>
          </div>
        </div>
      </Card>
    </div>
  );
}