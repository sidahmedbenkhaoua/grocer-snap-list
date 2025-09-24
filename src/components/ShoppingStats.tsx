import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CheckCircle2, Circle } from "lucide-react";
import type { ShoppingItemType } from "./ShoppingItem";

interface ShoppingStatsProps {
  items: ShoppingItemType[];
}

export const ShoppingStats = ({ items }: ShoppingStatsProps) => {
  const totalItems = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const pendingItems = totalItems - completedItems;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Card className="p-4 bg-gradient-card shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-fresh-green" />
          <h2 className="font-semibold">Ma liste de courses</h2>
        </div>
        <Badge variant="secondary" className="bg-fresh-green-light text-fresh-green">
          {progress}% complété
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 text-orange-fruit" />
          <span className="text-sm text-muted-foreground">
            À acheter: <span className="font-medium text-foreground">{pendingItems}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-fresh-green" />
          <span className="text-sm text-muted-foreground">
            Achetés: <span className="font-medium text-foreground">{completedItems}</span>
          </span>
        </div>
      </div>

      <div className="mt-3">
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-gradient-fresh h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
};