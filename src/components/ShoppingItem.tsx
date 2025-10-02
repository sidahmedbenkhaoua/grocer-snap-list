import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit2, Plus, Minus, Camera } from "lucide-react";
import { getDefaultImage } from "@/utils/defaultImages";
import { getCategoryColor, getCategoryIcon } from "@/utils/categoryUtils";
import { PurchasePhotos } from "./PurchasePhotos";
import type { PurchasePhoto } from "@/types/group";

export interface Purchase {
  id: string;
  purchasedBy: string;
  purchasedAt: string;
}

export interface ShoppingItemType {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  image?: string;
  completed: boolean;
  purchasePhotos?: PurchasePhoto[];
  purchases?: Purchase[];
  // Deprecated - kept for backward compatibility
  purchasedBy?: string;
  purchasedAt?: string;
}

interface ShoppingItemProps {
  item: ShoppingItemType;
  onUpdate: (item: ShoppingItemType) => void;
  onDelete: (id: string) => void;
  groupMembers?: Array<{ id: string; name: string; email: string; avatar?: string }>;
}


export const ShoppingItem = ({ item, onUpdate, onDelete, groupMembers = [] }: ShoppingItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [showPhotos, setShowPhotos] = useState(false);

  const handleToggleComplete = () => {
    const newCompleted = !item.completed;
    const currentUser = "Vous";
    
    if (newCompleted) {
      // Ajouter un nouvel achat
      const newPurchase: Purchase = {
        id: Date.now().toString(),
        purchasedBy: currentUser,
        purchasedAt: new Date().toISOString()
      };
      
      const existingPurchases = item.purchases || [];
      const updatedPurchases = [...existingPurchases, newPurchase];
      
      onUpdate({ 
        ...item, 
        completed: true,
        purchases: updatedPurchases,
        // Keep backward compatibility
        purchasedBy: currentUser,
        purchasedAt: newPurchase.purchasedAt
      });
    } else {
      // Supprimer le dernier achat de l'utilisateur actuel
      const existingPurchases = item.purchases || [];
      const updatedPurchases = existingPurchases.filter(
        (purchase, index, array) => {
          // Garde tous sauf le dernier achat de l'utilisateur actuel
          const lastUserPurchaseIndex = array.map(p => p.purchasedBy).lastIndexOf(currentUser);
          return !(purchase.purchasedBy === currentUser && index === lastUserPurchaseIndex);
        }
      );
      
      onUpdate({ 
        ...item, 
        completed: updatedPurchases.length > 0,
        purchases: updatedPurchases,
        // Update backward compatibility fields
        purchasedBy: updatedPurchases.length > 0 ? updatedPurchases[updatedPurchases.length - 1].purchasedBy : undefined,
        purchasedAt: updatedPurchases.length > 0 ? updatedPurchases[updatedPurchases.length - 1].purchasedAt : undefined
      });
    }
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
              {(() => {
                const CategoryIcon = getCategoryIcon(item.category);
                return (
                  <div className="flex items-center gap-1">
                    <CategoryIcon size={12} />
                    <span>{item.category}</span>
                  </div>
                );
              })()}
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
      
      {item.completed && (item.purchases?.length > 0 || item.purchasedBy) && (
        <div className="mt-3 pt-3 border-t border-border/50">
          {(() => {
            // Support backward compatibility
            const purchases = item.purchases || (item.purchasedBy ? [{
              id: '1',
              purchasedBy: item.purchasedBy,
              purchasedAt: item.purchasedAt || new Date().toISOString()
            }] : []);
            
            const purchaseCount = purchases.length;
            const displayPurchases = purchases.slice(-3); // Show last 3 purchases
            const remainingCount = purchaseCount - displayPurchases.length;
            
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-fresh-green">
                    Acheté {purchaseCount} fois
                  </span>
                  <div className="flex items-center -space-x-2">
                    {displayPurchases.map((purchase) => (
                      <Avatar key={purchase.id} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs bg-fresh-green text-white">
                          {purchase.purchasedBy.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {remainingCount > 0 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">
                          +{remainingCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(purchases[purchases.length - 1].purchasedAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            );
          })()}
        </div>
      )}
      
      {groupMembers.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Participants</span>
            <div className="flex items-center -space-x-2">
              {groupMembers.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : (
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              ))}
              {groupMembers.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    +{groupMembers.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};