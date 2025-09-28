import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload } from "lucide-react";
import { getCategoryIcon, categories } from "@/utils/categoryUtils";
import type { ShoppingItemType } from "./ShoppingItem";

interface AddItemFormProps {
  onAdd: (item: Omit<ShoppingItemType, 'id'>) => void;
}

const units = ["kg", "g", "L", "ml", "pièce(s)", "paquet(s)", "boîte(s)"];

export const AddItemForm = ({ onAdd }: AddItemFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pièce(s)");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) return;

    onAdd({
      name: name.trim(),
      quantity,
      unit,
      category,
      image,
      completed: false
    });

    // Reset form
    setName("");
    setQuantity(1);
    setUnit("pièce(s)");
    setCategory("");
    setImage(undefined);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-fresh hover:opacity-90 text-white shadow-card"
        size="lg"
      >
        <Plus className="mr-2 h-5 w-5" />
        Ajouter un article
      </Button>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card shadow-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Nom de l'article"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Quantité"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            required
          />
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => {
              const CategoryIcon = getCategoryIcon(cat);
              return (
                <SelectItem key={cat} value={cat}>
                  <div className="flex items-center gap-2">
                    <CategoryIcon size={16} />
                    <span>{cat}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground mb-2">
            <Upload className="h-4 w-4" />
            <span>Ajouter une photo personnalisée (optionnel)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Une photo par défaut sera utilisée selon la catégorie. Ajoutez une photo personnalisée uniquement si vous voulez montrer un produit spécifique.
          </p>
          {image && (
            <div className="mt-2">
              <img src={image} alt="Aperçu" className="w-16 h-16 object-cover rounded" />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setImage(undefined)}
                className="mt-1 text-xs"
              >
                Supprimer la photo
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-fresh-green hover:bg-fresh-green/90">
            Ajouter
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </form>
    </Card>
  );
};