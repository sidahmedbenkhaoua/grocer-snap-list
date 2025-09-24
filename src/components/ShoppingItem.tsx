import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Plus, Minus } from "lucide-react";

export interface ShoppingItemType {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  image?: string;
  completed: boolean;
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

  const handleToggleComplete = () => {
    onUpdate({ ...item, completed: !item.completed });
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
        
        {item.image && (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={item.image} 
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
        </div>
      </div>
    </Card>
  );
};