import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit2, Plus, Minus, Camera } from "lucide-react";
import { getDefaultImage } from "@/utils/defaultImages";
import { PurchasePhotos } from "./PurchasePhotos";
import type { PurchasePhoto } from "@/types/group";

export interface ShoppingItemType {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  image?: string;
  completed: boolean;
  purchasePhotos?: PurchasePhoto[];
  purchasedBy?: string;
  purchasedAt?: string;
}

interface ShoppingItemProps {
  item: ShoppingItemType;
  onUpdate: (item: ShoppingItemType) => void;
  onDelete: (id: string) => void;
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'légumes':
      return 'bg-fresh-green text-white';
    case 'fruits':
      return 'bg-orange-fruit text-white';
    case 'pain':
      return 'bg-amber-500 text-white';
    case 'viande':
      return 'bg-red-500 text-white';
    case 'produits laitiers':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

export const ShoppingItem = ({ item, onUpdate, onDelete }: ShoppingItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [showPhotos, setShowPhotos] = useState(false);

  const handleToggleComplete = () => {
    const newCompleted = !item.completed;
    onUpdate({ 
      ...item, 
      completed: newCompleted,
      purchasedBy: newCompleted ? "Vous" : undefined,
      purchasedAt: newCompleted ? new Date().toISOString() : undefined
    });
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    onUpdate({ ...item, quantity: newQuantity });
  };

  const handleNameEdit = () => {
    if (isEditing) {
      onUpdate({ ...item, name: editName });
    }
    setIsEditing(!isEditing);
  };

  const handlePhotosUpdate = (photos: PurchasePhoto[]) => {
    onUpdate({ 
      ...item, 
      purchasePhotos: photos,
      purchasedBy: photos.length > 0 ? "Vous" : undefined,
      purchasedAt: photos.length > 0 ? new Date().toISOString() : undefined
    });
  };

  // Utilise l'image personnalisée ou l'image par défaut de la catégorie
  const displayImage = item.image || getDefaultImage(item.category);

  return (
    <Card className={`p-4 transition-all duration-300 ${
      item.completed 
        ? 'bg-gradient-completed opacity-75' 
        : 'bg-gradient-card shadow-card hover:shadow-floating'
    }`}>
      <div className="flex items-center gap-3">
        <Checkbox
          checked={item.completed}
          onCheckedChange={handleToggleComplete}
          className="data-[state=checked]:bg-fresh-green data-[state=checked]:border-fresh-green"
        />
        
        {displayImage && (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
            <img 
              src={displayImage} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-sm"
                onBlur={handleNameEdit}
                onKeyDown={(e) => e.key === 'Enter' && handleNameEdit()}
                autoFocus
              />
            ) : (
              <h3 className={`font-medium truncate ${
                item.completed ? 'line-through text-muted-foreground' : ''
              }`}>
                {item.name}
              </h3>
            )}
            <Badge className={getCategoryColor(item.category)} variant="secondary">
              {item.category}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleQuantityChange(-1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium min-w-[3rem] text-center">
                {item.quantity} {item.unit}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowPhotos(!showPhotos)}
                title="Photos d'achat"
              >
                <Camera className="h-3 w-3" />
                {item.purchasePhotos && item.purchasePhotos.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-primary">
                    {item.purchasePhotos.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleNameEdit}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {showPhotos && (
            <div className="mt-3 pt-3 border-t border-border">
              <PurchasePhotos
                photos={item.purchasePhotos || []}
                onPhotosUpdate={handlePhotosUpdate}
                currentUser="Vous"
              />
            </div>
          )}
        </div>
      </div>
      
      {item.completed && item.purchasedBy && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-fresh-green text-white">
                {item.purchasedBy.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-fresh-green font-medium">
              Acheté par {item.purchasedBy}
            </span>
            {item.purchasedAt && (
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(item.purchasedAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};