import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Copy, UserPlus, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Group, Member } from "@/types/group";

interface GroupManagementProps {
  currentGroup: Group | null;
  onGroupChange: (group: Group | null) => void;
}

export const GroupManagement = ({ currentGroup, onGroupChange }: GroupManagementProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const generateGroupCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createGroup = () => {
    if (!groupName.trim()) return;

    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName.trim(),
      description: groupDescription.trim(),
      code: generateGroupCode(),
      createdAt: new Date().toISOString(),
      members: [
        {
          id: "creator",
          name: "Vous",
          email: "vous@example.com",
          joinedAt: new Date().toISOString()
        },
        {
          id: "member-2",
          name: "Sophie Martin",
          email: "sophie.martin@example.com",
          joinedAt: new Date().toISOString()
        },
        {
          id: "member-3",
          name: "Lucas Dubois",
          email: "lucas.dubois@example.com",
          joinedAt: new Date().toISOString()
        },
        {
          id: "member-4",
          name: "Marie Lefebvre",
          email: "marie.lefebvre@example.com",
          joinedAt: new Date().toISOString()
        }
      ],
      createdBy: "creator"
    };

    // Sauvegarder le groupe
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    groups.push(newGroup);
    localStorage.setItem('groups', JSON.stringify(groups));
    localStorage.setItem('currentGroup', JSON.stringify(newGroup));

    onGroupChange(newGroup);
    setShowCreateForm(false);
    setGroupName("");
    setGroupDescription("");
    
    toast({
      title: "Groupe créé !",
      description: `Le groupe "${newGroup.name}" a été créé. Code : ${newGroup.code}`
    });
  };

  const joinGroup = () => {
    if (!joinCode.trim()) return;

    const groups: Group[] = JSON.parse(localStorage.getItem('groups') || '[]');
    const group = groups.find(g => g.code === joinCode.trim().toUpperCase());

    if (group) {
      const newMember: Member = {
        id: Date.now().toString(),
        name: memberName || "Membre",
        email: memberEmail || "membre@example.com",
        joinedAt: new Date().toISOString()
      };

      group.members.push(newMember);
      localStorage.setItem('groups', JSON.stringify(groups));
      localStorage.setItem('currentGroup', JSON.stringify(group));
      
      onGroupChange(group);
      setShowJoinForm(false);
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
        description: "Ce code de groupe n'existe pas.",
        variant: "destructive"
      });
    }
  };

  const copyGroupCode = () => {
    if (currentGroup) {
      navigator.clipboard.writeText(currentGroup.code);
      toast({
        title: "Code copié !",
        description: "Le code du groupe a été copié dans le presse-papiers."
      });
    }
  };

  const leaveGroup = () => {
    localStorage.removeItem('currentGroup');
    onGroupChange(null);
    toast({
      title: "Groupe quitté",
      description: "Vous avez quitté le groupe."
    });
  };

  if (currentGroup) {
    return (
      <Card className="p-4 bg-gradient-card shadow-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">{currentGroup.name}</h3>
                <p className="text-sm text-muted-foreground">{currentGroup.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={leaveGroup}
              className="text-destructive hover:text-destructive"
            >
              Quitter
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Code d'invitation :</span>
            <Badge variant="outline" className="font-mono">
              {currentGroup.code}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyGroupCode}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">
              Membres ({currentGroup.members.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {currentGroup.members.slice(0, 3).map((member) => (
                <div key={member.id} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs">
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.name}</span>
                </div>
              ))}
              {currentGroup.members.length > 3 && (
                <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-2">
                  <Badge variant="secondary" className="text-xs">
                    +{currentGroup.members.length - 3} autres
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card shadow-card">
      <div className="space-y-4">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="font-semibold">Aucun groupe actif</h3>
          <p className="text-sm text-muted-foreground">
            Créez ou rejoignez un groupe pour partager votre liste de courses
          </p>
        </div>

        {!showCreateForm && !showJoinForm && (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="flex-1"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer un groupe
            </Button>
            <Button
              onClick={() => setShowJoinForm(true)}
              className="flex-1"
              variant="outline"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Rejoindre
            </Button>
          </div>
        )}

        {showCreateForm && (
          <div className="space-y-3">
            <Input
              placeholder="Nom du groupe (ex: Colocation Dupont)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <Input
              placeholder="Description (optionnel)"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={createGroup} className="flex-1">
                Créer
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {showJoinForm && (
          <div className="space-y-3">
            <Input
              placeholder="Code du groupe (6 caractères)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              maxLength={6}
            />
            <Input
              placeholder="Votre nom"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
            />
            <Input
              placeholder="Votre email (optionnel)"
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={joinGroup} className="flex-1">
                Rejoindre
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowJoinForm(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};