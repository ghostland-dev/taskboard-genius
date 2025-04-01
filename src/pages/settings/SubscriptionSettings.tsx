
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SubscriptionSettings: React.FC = () => {
  return (
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
  );
};

export default SubscriptionSettings;
