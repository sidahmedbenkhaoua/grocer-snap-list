import { useState, useEffect } from "react";
import { ShoppingItem, type ShoppingItemType } from "@/components/ShoppingItem";
import { AddItemForm } from "@/components/AddItemForm";
import { ShoppingStats } from "@/components/ShoppingStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import heroImage from "@/assets/shopping-hero.jpg";

const Index = () => {
  const [items, setItems] = useState<ShoppingItemType[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("");

  // Load items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('shoppingItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      // Add some demo items
      const demoItems: ShoppingItemType[] = [
        {
          id: "1",
          name: "Tomates",
          quantity: 2,
          unit: "kg",
          category: "Légumes",
          completed: false
        },
        {
          id: "2", 
          name: "Pain complet",
          quantity: 1,
          unit: "pièce(s)",
          category: "Pain",
          completed: false
        },
        {
          id: "3",
          name: "Pommes",
          quantity: 6,
          unit: "pièce(s)", 
          category: "Fruits",
          completed: true
        }
      ];
      setItems(demoItems);
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<ShoppingItemType, 'id'>) => {
    const item: ShoppingItemType = {
      ...newItem,
      id: Date.now().toString()
    };
    setItems(prev => [...prev, item]);
    toast({
      title: "Article ajouté !",
      description: `${item.name} a été ajouté à votre liste.`
    });
  };

  const updateItem = (updatedItem: ShoppingItemType) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const deleteItem = (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    if (item) {
      toast({
        title: "Article supprimé",
        description: `${item.name} a été retiré de votre liste.`
      });
    }
  };

  const clearCompleted = () => {
    const completedCount = items.filter(item => item.completed).length;
    setItems(prev => prev.filter(item => !item.completed));
    toast({
      title: "Articles supprimés",
      description: `${completedCount} article(s) acheté(s) supprimé(s) de la liste.`
    });
  };

  const categories = [...new Set(items.map(item => item.category))];
  const filteredItems = filterCategory 
    ? items.filter(item => item.category === filterCategory)
    : items;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-48 mb-6 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Liste de courses" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white mb-2">
            📝 Ma Liste de Courses
          </h1>
          <p className="text-white/90 text-sm">
            Organisez vos achats facilement
          </p>
        </div>
      </div>

      <div className="container max-w-md mx-auto px-4 pb-6 space-y-6">
        {/* Stats */}
        <ShoppingStats items={items} />

        {/* Add Item Form */}
        <AddItemForm onAdd={addItem} />

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory("")}
            >
              <Filter className="h-3 w-3 mr-1" />
              Tout
            </Button>
            {categories.map(category => (
              <Badge
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterCategory(filterCategory === category ? "" : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {filterCategory 
                ? `Aucun article dans la catégorie "${filterCategory}"`
                : "Votre liste est vide. Ajoutez votre premier article !"
              }
            </div>
          ) : (
            filteredItems.map(item => (
              <ShoppingItem
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onDelete={deleteItem}
              />
            ))
          )}
        </div>

        {/* Clear Completed Button */}
        {items.some(item => item.completed) && (
          <Button 
            variant="outline"
            className="w-full"
            onClick={clearCompleted}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer les articles achetés
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;
