import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { PurchasePhoto } from "@/types/group";

interface PurchasePhotosProps {
  photos: PurchasePhoto[];
  onPhotosUpdate: (photos: PurchasePhoto[]) => void;
  currentUser?: string;
}

export const PurchasePhotos = ({ photos = [], onPhotosUpdate, currentUser = "Vous" }: PurchasePhotosProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const newPhotos: PurchasePhoto[] = [];

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: PurchasePhoto = {
            id: `${Date.now()}-${index}`,
            url: event.target.result as string,
            uploadedBy: currentUser,
            uploadedAt: new Date().toISOString()
          };
          newPhotos.push(newPhoto);

          // Si c'est la dernière photo traitée
          if (newPhotos.length === files.length) {
            onPhotosUpdate([...photos, ...newPhotos]);
            setIsUploading(false);
            toast({
              title: "Photos ajoutées !",
              description: `${newPhotos.length} photo(s) ajoutée(s) à l'article.`
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    onPhotosUpdate(updatedPhotos);
    toast({
      title: "Photo supprimée",
      description: "La photo a été retirée de l'article."
    });
  };

  return (
    <div className="space-y-3">
      {photos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Photos d'achat ({photos.length})
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.url}
                  alt="Photo d'achat"
                  className="w-full h-24 object-cover rounded-lg bg-secondary"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(photo.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded flex items-center gap-1">
                  <Avatar className="h-3 w-3">
                    <AvatarFallback className="text-[8px]">
                      {photo.uploadedBy.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{photo.uploadedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={isUploading}
            asChild
          >
            <span>
              {isUploading ? (
                "Ajout en cours..."
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {photos.length > 0 ? "Ajouter d'autres photos" : "Ajouter des photos d'achat"}
                </>
              )}
            </span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-1 text-center">
          Ajoutez des photos pour montrer ce qui a été acheté
        </p>
      </div>
    </div>
  );
};