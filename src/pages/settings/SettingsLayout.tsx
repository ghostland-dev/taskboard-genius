
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";
import ExportSettings from "./ExportSettings";
import SubscriptionSettings from "./SubscriptionSettings";

const SettingsLayout: React.FC = () => {
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

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="export">
          <ExportSettings />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsLayout;
