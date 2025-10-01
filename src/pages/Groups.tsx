import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Copy, UserPlus, Settings, ArrowLeft, Crown, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Group, Member } from "@/types/group";

export default function Groups() {
  const isMobile = useIsMobile();
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  useEffect(() => {
    // Charger le groupe actuel et tous les groupes de l'utilisateur
    const savedGroup = localStorage.getItem('currentGroup');
    const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    
    if (savedGroup) {
      setCurrentGroup(JSON.parse(savedGroup));
    }
    setUserGroups(allGroups);
  }, []);

  const generateGroupCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createGroup = () => {
    if (!groupName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du groupe est obligatoire",
        variant: "destructive"
      });
      return;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName.trim(),
      description: groupDescription.trim(),
      code: generateGroupCode(),
      createdAt: new Date().toISOString(),
      members: [{
        id: "creator",
        name: "Vous",
        email: "vous@example.com",
        joinedAt: new Date().toISOString()
      }],
      createdBy: "creator"
    };

    const groups = [...userGroups, newGroup];
    setUserGroups(groups);
    localStorage.setItem('groups', JSON.stringify(groups));
    localStorage.setItem('currentGroup', JSON.stringify(newGroup));
    setCurrentGroup(newGroup);

    setShowCreateForm(false);
    setGroupName("");
    setGroupDescription("");
    
    toast({
      title: "Groupe créé !",
      description: `Le groupe "${newGroup.name}" a été créé avec succès`
    });
  };

  const joinGroup = () => {
    if (!joinCode.trim()) {
      toast({
        title: "Erreur",
        description: "Le code du groupe est obligatoire",
        variant: "destructive"
      });
      return;
    }

    const group = userGroups.find(g => g.code === joinCode.trim().toUpperCase());

    if (group) {
      const newMember: Member = {
        id: Date.now().toString(),
        name: memberName || "Nouveau membre",
        email: memberEmail || "membre@example.com",
        joinedAt: new Date().toISOString()
      };

      const updatedGroup = {
        ...group,
        members: [...group.members, newMember]
      };

      const updatedGroups = userGroups.map(g => g.id === group.id ? updatedGroup : g);
      setUserGroups(updatedGroups);
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      localStorage.setItem('currentGroup', JSON.stringify(updatedGroup));
      setCurrentGroup(updatedGroup);
      
      setJoinCode("");
      setMemberName("");
      setMemberEmail("");

      toast({
        title: "Groupe rejoint !",
        description: `Vous avez rejoint le groupe "${group.name}"`
      });
    } else {
      toast({
        title: "Code invalide",
        description: "Ce code de groupe n'existe pas",
        variant: "destructive"
      });
    }
  };

  const switchToGroup = (group: Group) => {
    setCurrentGroup(group);
    localStorage.setItem('currentGroup', JSON.stringify(group));
    toast({
      title: "Groupe activé",
      description: `Vous utilisez maintenant le groupe "${group.name}"`
    });
  };

  const copyGroupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copié !",
      description: "Le code du groupe a été copié dans le presse-papiers"
    });
  };

  const leaveGroup = (groupId: string) => {
    const updatedGroups = userGroups.filter(g => g.id !== groupId);
    setUserGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    
    if (currentGroup?.id === groupId) {
      setCurrentGroup(null);
      localStorage.removeItem('currentGroup');
    }
    
    toast({
      title: "Groupe quitté",
      description: "Vous avez quitté le groupe avec succès"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Gestion des Groupes</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Créez, rejoignez et gérez vos groupes pour partager vos listes de courses
        </p>
      </div>

      <Tabs defaultValue="current" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current" className="text-xs md:text-sm">
            {isMobile ? "Actuel" : "Groupe Actuel"}
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs md:text-sm">
            {isMobile ? "Groupes" : "Mes Groupes"}
          </TabsTrigger>
          <TabsTrigger value="join" className="text-xs md:text-sm">
            {isMobile ? "Rejoindre" : "Rejoindre/Créer"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {currentGroup ? (
            <Card className="shadow-card">
              <CardHeader className="p-4 md:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="flex flex-wrap items-center gap-2 text-base md:text-lg">
                        <span className="truncate">{currentGroup.name}</span>
                        {currentGroup.createdBy === "creator" && (
                          <Crown className="h-3 w-3 md:h-4 md:w-4 text-accent flex-shrink-0" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm truncate">
                        {currentGroup.description || "Aucune description"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => leaveGroup(currentGroup.id)}
                    className="w-full sm:w-auto"
                  >
                    Quitter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-3 md:p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-xs md:text-sm font-medium">Code d'invitation</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="font-mono text-sm md:text-lg px-2 md:px-3 py-1">
                        {currentGroup.code}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyGroupCode(currentGroup.code)}
                      >
                        <Copy className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <Label className="text-xs md:text-sm font-medium">Créé le</Label>
                    <div className="flex items-center gap-1 mt-1 text-xs md:text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span className="whitespace-nowrap">{formatDate(currentGroup.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm md:text-base font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-3 w-3 md:h-4 md:w-4" />
                    Membres ({currentGroup.members.length})
                  </h3>
                  <div className="grid gap-2 md:gap-3 sm:grid-cols-2">
                    {currentGroup.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 border rounded-lg">
                        <Avatar className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-xs md:text-sm">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 md:gap-2">
                            <span className="text-xs md:text-sm font-medium truncate">{member.name}</span>
                            {member.id === currentGroup.createdBy && (
                              <Crown className="h-3 w-3 text-accent flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-8 md:py-12 p-4">
                <div className="p-3 md:p-4 bg-muted/50 rounded-full mb-4">
                  <Users className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-center">Aucun groupe actuel</h3>
                <p className="text-sm md:text-base text-muted-foreground text-center mb-6 max-w-md">
                  Vous n'avez pas de groupe actif. Créez-en un nouveau ou rejoignez un groupe existant.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button onClick={() => setShowCreateForm(true)} className="w-full sm:w-auto" size={isMobile ? "sm" : "default"}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un groupe
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto" size={isMobile ? "sm" : "default"}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Rejoindre un groupe
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {userGroups.length > 0 ? (
            <div className="grid gap-3 md:gap-4">
              {userGroups.map((group) => (
                <Card key={group.id} className="shadow-card">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
                      <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm md:text-base font-semibold flex flex-wrap items-center gap-1 md:gap-2">
                            <span className="truncate">{group.name}</span>
                            {group.id === currentGroup?.id && (
                              <Badge variant="default" className="text-xs flex-shrink-0">Actuel</Badge>
                            )}
                            {group.createdBy === "creator" && (
                              <Crown className="h-3 w-3 text-accent flex-shrink-0" />
                            )}
                          </h4>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {group.members.length} membre{group.members.length > 1 ? 's' : ''} • 
                            Code: {group.code}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                        {group.id !== currentGroup?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => switchToGroup(group)}
                            className="flex-1 lg:flex-none text-xs md:text-sm"
                          >
                            Activer
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyGroupCode(group.code)}
                        >
                          <Copy className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => leaveGroup(group.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <span className="hidden sm:inline">Quitter</span>
                          <span className="sm:hidden text-xs">Quitter</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-8 md:py-12 p-4">
                <div className="p-3 md:p-4 bg-muted/50 rounded-full mb-4">
                  <Users className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">Aucun groupe</h3>
                <p className="text-sm md:text-base text-muted-foreground text-center">
                  Vous n'êtes membre d'aucun groupe pour le moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="join" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* Créer un groupe */}
            <Card className="shadow-card">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Plus className="h-4 w-4 md:h-5 md:w-5" />
                  Créer un Groupe
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Créez un nouveau groupe pour partager vos listes de courses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0 md:pt-0">
                <div className="space-y-2">
                  <Label htmlFor="groupName" className="text-xs md:text-sm">Nom du groupe *</Label>
                  <Input
                    id="groupName"
                    placeholder="ex: Colocation Dupont"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupDescription" className="text-xs md:text-sm">Description</Label>
                  <Input
                    id="groupDescription"
                    placeholder="Description du groupe (optionnel)"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button onClick={createGroup} className="w-full" size={isMobile ? "sm" : "default"}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le Groupe
                </Button>
              </CardContent>
            </Card>

            {/* Rejoindre un groupe */}
            <Card className="shadow-card">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <UserPlus className="h-4 w-4 md:h-5 md:w-5" />
                  Rejoindre un Groupe
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Utilisez un code d'invitation pour rejoindre un groupe existant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0 md:pt-0">
                <div className="space-y-2">
                  <Label htmlFor="joinCode" className="text-xs md:text-sm">Code d'invitation *</Label>
                  <Input
                    id="joinCode"
                    placeholder="Entrez le code (6 caractères)"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="font-mono text-center text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberName" className="text-xs md:text-sm">Votre nom *</Label>
                  <Input
                    id="memberName"
                    placeholder="Votre nom d'affichage"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberEmail" className="text-xs md:text-sm">Email</Label>
                  <Input
                    id="memberEmail"
                    type="email"
                    placeholder="votre@email.com (optionnel)"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button onClick={joinGroup} className="w-full" size={isMobile ? "sm" : "default"}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Rejoindre le Groupe
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}