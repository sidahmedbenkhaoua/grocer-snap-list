import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Eye, Copy, Trash2, ShoppingCart } from "lucide-react";
import type { ShoppingItemType } from "@/components/ShoppingItem";

interface SavedList {
  id: string;
  name: string;
  createdAt: string;
  completedAt?: string;
  items: ShoppingItemType[];
  totalItems: number;
  completedItems: number;
}

// Mock data pour les anciennes listes
const mockLists: SavedList[] = [
  {
    id: "1",
    name: "Course du weekend",
    createdAt: "2024-01-15",
    completedAt: "2024-01-15",
    items: [
      { id: "1", name: "Tomates", quantity: 2, unit: "kg", category: "Légumes", completed: true },
      { id: "2", name: "Pain complet", quantity: 1, unit: "pièce(s)", category: "Pain", completed: true },
      { id: "3", name: "Lait", quantity: 1, unit: "L", category: "Produits laitiers", completed: true },
    ],
    totalItems: 3,
    completedItems: 3,
  },
  {
    id: "2", 
    name: "Courses de la semaine",
    createdAt: "2024-01-10",
    completedAt: "2024-01-12",
    items: [
      { id: "4", name: "Pommes", quantity: 6, unit: "pièce(s)", category: "Fruits", completed: true },
      { id: "5", name: "Pâtes", quantity: 2, unit: "paquet(s)", category: "Épicerie", completed: true },
      { id: "6", name: "Fromage", quantity: 200, unit: "g", category: "Produits laitiers", completed: false },
    ],
    totalItems: 3,
    completedItems: 2,
  },
  {
    id: "3",
    name: "Course express",
    createdAt: "2024-01-08", 
    items: [
      { id: "7", name: "Eau", quantity: 6, unit: "L", category: "Boissons", completed: true },
      { id: "8", name: "Yaourts", quantity: 8, unit: "pièce(s)", category: "Produits laitiers", completed: true },
    ],
    totalItems: 2,
    completedItems: 2,
  },
];

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState<SavedList | null>(null);

  const filteredLists = mockLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (list: SavedList) => {
    if (list.completedItems === list.totalItems) {
      return <Badge className="bg-fresh-green text-white">Terminée</Badge>;
    }
    return <Badge variant="secondary">Partielle ({list.completedItems}/{list.totalItems})</Badge>;
  };

  const handleCopyToNewList = (list: SavedList) => {
    // Simulation - dans une vraie app, ceci créerait une nouvelle liste
    console.log("Copie de la liste:", list.name);
    // toast({ title: "Liste copiée", description: "La liste a été ajoutée à votre liste actuelle" });
  };

  const handleDeleteList = (listId: string) => {
    console.log("Suppression de la liste:", listId);
    // Dans une vraie app, ceci supprimerait la liste
  };

  if (selectedList) {
    return (
      <div className="container max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedList(null)}
          >
            ← Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedList.name}</h1>
            <p className="text-muted-foreground">
              Créée le {formatDate(selectedList.createdAt)}
              {selectedList.completedAt && ` • Terminée le ${formatDate(selectedList.completedAt)}`}
            </p>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Articles ({selectedList.totalItems})</h2>
            <div className="flex gap-2">
              {getStatusBadge(selectedList)}
              <Button 
                size="sm" 
                onClick={() => handleCopyToNewList(selectedList)}
                className="bg-fresh-green hover:bg-fresh-green/90"
              >
                <Copy className="h-4 w-4 mr-2" />
                Réutiliser
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {selectedList.items.map((item) => (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  item.completed ? 'bg-completed/20 opacity-75' : 'bg-background'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.completed ? 'bg-fresh-green' : 'bg-muted'
                  }`} />
                  <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Mes Anciennes Listes</h1>
        <p className="text-muted-foreground">
          Retrouvez et réutilisez vos listes de courses précédentes
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une liste..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <Card className="p-6 bg-gradient-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-fresh-green">{mockLists.length}</div>
            <div className="text-sm text-muted-foreground">Listes sauvées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-fruit">
              {mockLists.reduce((acc, list) => acc + list.totalItems, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Articles au total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {mockLists.filter(list => list.completedItems === list.totalItems).length}
            </div>
            <div className="text-sm text-muted-foreground">Listes complétées</div>
          </div>
        </div>
      </Card>

      {/* Lists */}
      <div className="grid gap-4">
        {filteredLists.length === 0 ? (
          <Card className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune liste trouvée</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Aucune liste ne correspond à votre recherche." : "Vous n'avez pas encore de listes sauvées."}
            </p>
          </Card>
        ) : (
          filteredLists.map((list) => (
            <Card key={list.id} className="p-4 hover:shadow-card transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{list.name}</h3>
                    {getStatusBadge(list)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(list.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-4 w-4" />
                      {list.totalItems} article{list.totalItems > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedList(list)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyToNewList(list)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Réutiliser
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteList(list.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}