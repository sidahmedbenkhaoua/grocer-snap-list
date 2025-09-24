import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Bell, Smartphone, Trash2, Download, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Paramètres</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience de l'application
        </p>
      </div>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-fresh-green" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifs">Notifications push</Label>
              <p className="text-sm text-muted-foreground">Recevez des alertes sur votre appareil</p>
            </div>
            <Switch id="push-notifs" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifs">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">Recevez un résumé hebdomadaire</p>
            </div>
            <Switch id="email-notifs" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="completion-notifs">Rappels de completion</Label>
              <p className="text-sm text-muted-foreground">Rappel pour finir vos listes</p>
            </div>
            <Switch id="completion-notifs" defaultChecked />
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="h-5 w-5 text-fresh-green" />
          <h2 className="text-xl font-semibold">Préférences</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Unité par défaut</Label>
            <Select defaultValue="piece">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piece">Pièce(s)</SelectItem>
                <SelectItem value="kg">Kilogramme</SelectItem>
                <SelectItem value="g">Gramme</SelectItem>
                <SelectItem value="l">Litre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Catégorie par défaut</Label>
            <Select defaultValue="autres">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="legumes">Légumes</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="epicerie">Épicerie</SelectItem>
                <SelectItem value="autres">Autres</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-photos">Photos automatiques</Label>
              <p className="text-sm text-muted-foreground">Utiliser les images par défaut</p>
            </div>
            <Switch id="auto-photos" defaultChecked />
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="h-5 w-5 text-fresh-green" />
          <h2 className="text-xl font-semibold">Gestion des données</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Sauvegarde automatique</Label>
              <p className="text-sm text-muted-foreground">Sauvegarder vos listes localement</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Upload className="mr-2 h-4 w-4" />
              Exporter mes données
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Importer des données
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Effacer toutes les données
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-fresh-green hover:bg-fresh-green/90">
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
}