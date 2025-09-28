import { Apple, Carrot, Wheat, Beef, Milk, Coffee, Sparkles, ShoppingCart, MoreHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const getCategoryColor = (category: string) => {
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
    case 'boissons':
      return 'bg-cyan-500 text-white';
    case 'entretien':
      return 'bg-purple-500 text-white';
    case 'epicerie':
    case 'épicerie':
      return 'bg-orange-500 text-white';
    case 'hygiène':
      return 'bg-pink-500 text-white';
    case 'autres':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

export const getCategoryIcon = (category: string): LucideIcon => {
  switch (category.toLowerCase()) {
    case 'légumes':
      return Carrot;
    case 'fruits':
      return Apple;
    case 'pain':
      return Wheat;
    case 'viande':
      return Beef;
    case 'produits laitiers':
      return Milk;
    case 'boissons':
      return Coffee;
    case 'entretien':
      return Sparkles;
    case 'epicerie':
    case 'épicerie':
      return ShoppingCart;
    case 'hygiène':
      return Sparkles;
    case 'autres':
      return MoreHorizontal;
    default:
      return MoreHorizontal;
  }
};

export const categories = [
  "Légumes",
  "Fruits", 
  "Pain",
  "Viande",
  "Produits laitiers",
  "Épicerie",
  "Boissons",
  "Hygiène",
  "Entretien",
  "Autres"
];