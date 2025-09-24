import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, ShoppingCart, TrendingUp } from "lucide-react";

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
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const completionRate = Math.round((mockUser.stats.completedLists / mockUser.stats.totalLists) * 100);

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Mon Profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et consultez vos statistiques
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Info */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="text-lg">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{mockUser.name}</h2>
                <p className="text-muted-foreground">{mockUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    Membre depuis le {formatDate(mockUser.joinDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations personnelles</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" value={mockUser.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={mockUser.email} readOnly />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="bg-fresh-green hover:bg-fresh-green/90">
                  Modifier le profil
                </Button>
                <Button variant="outline">
                  Changer le mot de passe
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-fresh-green">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Taux de completion</div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-fresh-green" />
                  <span className="text-sm">Listes créées</span>
                </div>
                <Badge variant="secondary">{mockUser.stats.totalLists}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-fruit" />
                  <span className="text-sm">Articles total</span>
                </div>
                <Badge variant="secondary">{mockUser.stats.totalItems}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm">Moyenne/liste</span>
                </div>
                <Badge variant="secondary">{mockUser.stats.averageItems}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-fresh-green-light/20 rounded-lg">
            <span className="text-sm">Liste "Course du weekend" terminée</span>
            <span className="text-xs text-muted-foreground">Il y a 2 heures</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-fruit-light/20 rounded-lg">
            <span className="text-sm">Nouvelle liste "Courses de la semaine" créée</span>
            <span className="text-xs text-muted-foreground">Il y a 1 jour</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <span className="text-sm">Profil mis à jour</span>
            <span className="text-xs text-muted-foreground">Il y a 3 jours</span>
          </div>
        </div>
      </Card>
    </div>
  );
}