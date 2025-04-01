import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks, Task } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [exportFormat, setExportFormat] = useState("pdf");

  const handleExportData = () => {
    // In a real app, this would generate and download the file
    // For this demo, we'll just show a toast message
    toast.success(`Données exportées en format ${exportFormat.toUpperCase()} !`, {
      description: "Le fichier a été téléchargé avec succès."
    });

    // For demonstration, let's convert tasks to JSON
    const jsonData = JSON.stringify(tasks, null, 2);
    console.log("Exported data:", jsonData);
  };

  const saveNotificationSettings = () => {
    toast.success("Paramètres de notification enregistrés !", {
      description: "Vos préférences ont été mises à jour."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-heading">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Gérez vos préférences et votre compte</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="export">Exportation</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Information du compte</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  defaultValue={user?.name || ""}
                  readOnly={user?.role === "superadmin"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  readOnly={user?.role === "superadmin"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Input
                  id="role"
                  defaultValue={
                    user?.role === "superadmin"
                      ? "Super Admin"
                      : user?.role === "admin"
                      ? "Administrateur"
                      : "Utilisateur"
                  }
                  readOnly
                />
              </div>

              <Button className="bg-brand-500 hover:bg-brand-600 mt-4">
                Sauvegarder les changements
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>
                Mettez à jour votre mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Button className="bg-brand-500 hover:bg-brand-600 mt-4">
                Mettre à jour le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Configurez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez des alertes de tâches par email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications SMS</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez des alertes de tâches par SMS
                  </p>
                </div>
                <Switch 
                  checked={smsNotifications} 
                  onCheckedChange={setSmsNotifications} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications push</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez des alertes dans l'application
                  </p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications} 
                />
              </div>

              <Button onClick={saveNotificationSettings} className="bg-brand-500 hover:bg-brand-600 mt-4">
                Sauvegarder les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Settings */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Exporter vos données</CardTitle>
              <CardDescription>
                Téléchargez vos tâches et informations dans différents formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="export-format">Format d'exportation</Label>
                <Select
                  value={exportFormat}
                  onValueChange={setExportFormat}
                >
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Sélectionnez un format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Options d'exportation</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-completed"
                      className="rounded border-gray-300"
                      defaultChecked
                    />
                    <Label htmlFor="include-completed">Inclure les tâches terminées</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-details"
                      className="rounded border-gray-300"
                      defaultChecked
                    />
                    <Label htmlFor="include-details">Inclure les détails des tâches</Label>
                  </div>
                </div>
              </div>

              <Button onClick={handleExportData} className="mt-4">
                <Download size={16} className="mr-2" />
                Exporter {tasks.length} tâches
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Settings */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Votre abonnement</CardTitle>
              <CardDescription>
                Gérez votre forfait et vos options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-brand-100 p-4 rounded-lg">
                <p className="font-medium">Forfait actuel: <span className="text-brand-600">Période d'essai</span></p>
                <p className="text-sm text-muted-foreground mt-1">
                  Il vous reste 10 jours d'essai. Passez à un forfait payant pour débloquer toutes les fonctionnalités.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="border-2 border-brand-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-brand-600">Forfait Standard</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold">9,99€/mois</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Jusqu'à 500 tâches
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Notifications par email
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Exportation PDF
                      </li>
                    </ul>
                    <Button className="w-full">S'abonner</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Forfait Premium</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold">19,99€/mois</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Tâches illimitées
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Notifications email + SMS
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Exports PDF et CSV
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Support prioritaire
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full">S'abonner</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
