
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const NotificationSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const saveNotificationSettings = () => {
    toast.success("Paramètres de notification enregistrés !", {
      description: "Vos préférences ont été mises à jour."
    });
  };

  return (
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
  );
};

export default NotificationSettings;
