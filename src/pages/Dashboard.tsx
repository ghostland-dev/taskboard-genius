
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, CheckCircle, Clock, Users } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-heading">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue, {user?.name || "utilisateur"} ! Voici un aperçu de votre activité récente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Tâches à faire</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">En cours</p>
                <p className="text-3xl font-bold">5</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Utilisateurs actifs</p>
                <p className="text-3xl font-bold">42</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Statistiques</p>
                <p className="text-3xl font-bold">+15%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 h-10 w-10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium">Tâche complétée</p>
                      <p className="text-sm text-muted-foreground">Il y a {item * 3} heures</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Projet Alpha
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tâches à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b pb-2 last:border-0">
                  <div className={`h-3 w-3 rounded-full ${
                    item === 1 ? "bg-red-500" : item === 2 ? "bg-amber-500" : "bg-green-500"
                  }`} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">Réunion d'équipe {item}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() + item * 86400000).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">Planification du sprint</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
