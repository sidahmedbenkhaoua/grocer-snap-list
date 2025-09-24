import legumesImg from "@/assets/categories/legumes.jpg";
import fruitsImg from "@/assets/categories/fruits.jpg";
import painImg from "@/assets/categories/pain.jpg";
import viandeImg from "@/assets/categories/viande.jpg";
import produitsLaitiersImg from "@/assets/categories/produits-laitiers.jpg";
import epicerieImg from "@/assets/categories/epicerie.jpg";
import boissonsImg from "@/assets/categories/boissons.jpg";
import hygieneImg from "@/assets/categories/hygiene.jpg";
import entretienImg from "@/assets/categories/entretien.jpg";
import autresImg from "@/assets/categories/autres.jpg";

export const getDefaultImage = (category: string): string | undefined => {
  const categoryLower = category.toLowerCase();
  
  switch (categoryLower) {
    case 'légumes':
      return legumesImg;
    case 'fruits':
      return fruitsImg;
    case 'pain':
      return painImg;
    case 'viande':
      return viandeImg;
    case 'produits laitiers':
      return produitsLaitiersImg;
    case 'épicerie':
      return epicerieImg;
    case 'boissons':
      return boissonsImg;
    case 'hygiène':
      return hygieneImg;
    case 'entretien':
      return entretienImg;
    case 'autres':
      return autresImg;
    default:
      return autresImg; // Image par défaut pour les catégories non définies
  }
};

export const categoryImages = {
  'Légumes': legumesImg,
  'Fruits': fruitsImg,
  'Pain': painImg,
  'Viande': viandeImg,
  'Produits laitiers': produitsLaitiersImg,
  'Épicerie': epicerieImg,
  'Boissons': boissonsImg,
  'Hygiène': hygieneImg,
  'Entretien': entretienImg,
  'Autres': autresImg,
};