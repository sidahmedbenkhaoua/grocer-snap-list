import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, CheckCircle, XCircle, Clock, Inbox } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Invitation } from "@/types/invitation";
import type { Group, Member } from "@/types/group";

export default function Invitations() {
  const isMobile = useIsMobile();
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    // Charger les invitations depuis le localStorage
    const savedInvitations = JSON.parse(localStorage.getItem('invitations') || '[]');
    setInvitations(savedInvitations);
  }, []);

  const handleAccept = (invitation: Invitation) => {
    // Récupérer les groupes
    const groups: Group[] = JSON.parse(localStorage.getItem('groups') || '[]');
    const group = groups.find(g => g.id === invitation.groupId);

    if (group) {
      // Ajouter le membre au groupe
      const newMember: Member = {
        id: Date.now().toString(),
        name: "Vous",
        email: "vous@example.com",
        joinedAt: new Date().toISOString()
      };

      group.members.push(newMember);
      localStorage.setItem('groups', JSON.stringify(groups));
      
      // Marquer l'invitation comme acceptée
      const updatedInvitations = invitations.map(inv =>
        inv.id === invitation.id ? { ...inv, status: 'accepted' as const } : inv
      );
      setInvitations(updatedInvitations);
      localStorage.setItem('invitations', JSON.stringify(updatedInvitations));

      toast({
        title: "Invitation acceptée !",
        description: `Vous avez rejoint le groupe "${group.name}"`
      });
    }
  };

  const handleRefuse = (invitation: Invitation) => {
    // Marquer l'invitation comme refusée
    const updatedInvitations = invitations.map(inv =>
      inv.id === invitation.id ? { ...inv, status: 'refused' as const } : inv
    );
    setInvitations(updatedInvitations);
    localStorage.setItem('invitations', JSON.stringify(updatedInvitations));

    toast({
      title: "Invitation refusée",
      description: "L'invitation a été déclinée"
    });
  };

  const handleDelete = (invitationId: string) => {
    const updatedInvitations = invitations.filter(inv => inv.id !== invitationId);
    setInvitations(updatedInvitations);
    localStorage.setItem('invitations', JSON.stringify(updatedInvitations));

    toast({
      title: "Invitation supprimée",
      description: "L'invitation a été supprimée"
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const processedInvitations = invitations.filter(inv => inv.status !== 'pending');

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Invitations
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Gérez vos invitations aux groupes
        </p>
      </div>

      {/* Invitations en attente */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          En attente
          {pendingInvitations.length > 0 && (
            <Badge variant="default" className="text-xs">
              {pendingInvitations.length}
            </Badge>
          )}
        </h2>

        {pendingInvitations.length > 0 ? (
          <div className="grid gap-3 md:gap-4">
            {pendingInvitations.map((invitation) => (
              <Card key={invitation.id} className="shadow-card border-primary/20">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 md:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                        <Mail className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base md:text-lg font-semibold truncate">
                            {invitation.groupName}
                          </h3>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            Nouveau
                          </Badge>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mb-2">
                          {invitation.groupDescription || "Aucune description"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5 md:h-6 md:w-6">
                            <AvatarFallback className="text-xs">
                              {invitation.invitedByName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">
                            Invité par <span className="font-medium">{invitation.invitedByName}</span>
                          </span>
                          <span>•</span>
                          <span className="whitespace-nowrap">{formatDate(invitation.invitedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => handleAccept(invitation)}
                        className="flex-1"
                        size={isMobile ? "sm" : "default"}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accepter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRefuse(invitation)}
                        className="flex-1"
                        size={isMobile ? "sm" : "default"}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Refuser
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
                <Inbox className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Aucune invitation en attente</h3>
              <p className="text-xs md:text-sm text-muted-foreground text-center">
                Vous n'avez pas d'invitations à traiter pour le moment
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Invitations traitées */}
      {processedInvitations.length > 0 && (
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Historique
          </h2>
          <div className="grid gap-3 md:gap-4">
            {processedInvitations.map((invitation) => (
              <Card key={invitation.id} className="shadow-card opacity-70">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        invitation.status === 'accepted' 
                          ? 'bg-green-500/10' 
                          : 'bg-destructive/10'
                      }`}>
                        {invitation.status === 'accepted' ? (
                          <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 md:h-5 md:w-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm md:text-base font-medium truncate">
                          {invitation.groupName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {invitation.status === 'accepted' ? 'Acceptée' : 'Refusée'} • {formatDate(invitation.invitedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(invitation.id)}
                      className="flex-shrink-0"
                    >
                      <span className="text-xs">Supprimer</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
