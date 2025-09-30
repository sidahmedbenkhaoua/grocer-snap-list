// Liste d'articles courants par catégorie pour l'autocomplétion
export const commonItems: Record<string, string[]> = {
  "Fruits": [
    "Pommes", "Bananes", "Oranges", "Fraises", "Raisins", "Kiwis", 
    "Mangues", "Ananas", "Poires", "Cerises", "Pêches", "Abricots"
  ],
  "Légumes": [
    "Tomates", "Carottes", "Pommes de terre", "Oignons", "Courgettes", 
    "Poivrons", "Brocolis", "Salade", "Concombre", "Haricots verts"
  ],
  "Pain & Viennoiseries": [
    "Baguette", "Pain de mie", "Croissants", "Pain complet", 
    "Brioches", "Pain aux céréales", "Pains au chocolat"
  ],
  "Produits laitiers": [
    "Lait", "Yaourts", "Fromage", "Beurre", "Crème fraîche", 
    "Fromage blanc", "Mozzarella", "Emmental", "Camembert"
  ],
  "Viande & Poisson": [
    "Poulet", "Bœuf haché", "Steak", "Saumon", "Thon", 
    "Jambon", "Côtes de porc", "Merguez", "Escalope de dinde"
  ],
  "Épicerie": [
    "Pâtes", "Riz", "Farine", "Sucre", "Sel", "Huile", 
    "Conserves", "Céréales", "Café", "Thé", "Chocolat"
  ],
  "Boissons": [
    "Eau", "Jus d'orange", "Soda", "Vin", "Bière", 
    "Jus de fruits", "Limonade", "Thé glacé"
  ],
  "Hygiène & Cosmétique": [
    "Shampoing", "Savon", "Dentifrice", "Déodorant", 
    "Gel douche", "Papier toilette", "Mouchoirs"
  ],
  "Entretien": [
    "Lessive", "Liquide vaisselle", "Éponges", "Nettoyant sol", 
    "Essuie-tout", "Sacs poubelle", "Javel"
  ],
  "Autres": [
    "Sacs congélation", "Aluminium", "Film alimentaire", "Allumettes"
  ]
};

export const getAllCommonItems = (): string[] => {
  return Object.values(commonItems).flat();
};

export const getItemsByCategory = (category: string): string[] => {
  return commonItems[category] || [];
};
