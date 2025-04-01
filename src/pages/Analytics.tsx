import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AccessDeniedAlert from "@/components/analytics/AccessDeniedAlert";

// Composant fictif pour la démonstration - à remplacer par de vrais graphiques
const ChartPlaceholder = ({ type }: { type: string }) => (
  <div className="flex flex-col items-center justify-center h-60 bg-slate-50 rounded-md border">
    {type === "bar" && <BarChart3 className="h-10 w-10 text-slate-400 mb-2" />}
    {type === "line" && <LineChart className="h-10 w-10 text-slate-400 mb-2" />}
    {type === "pie" && <PieChart className="h-10 w-10 text-slate-400 mb-2" />}
    <p className="text-slate-500">Données du graphique {type}</p>
  </div>
);

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState("month");
  
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  
  if (!isAdmin) {
    return <AccessDeniedAlert />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Statistiques</h1>
          <p className="text-muted-foreground mt-1">
            Analysez les performances de votre application
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Jour</SelectItem>
            <SelectItem value="week">Semaine</SelectItem>
            <SelectItem value="month">Mois</SelectItem>
            <SelectItem value="year">Année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Sessions</p>
                <p className="text-3xl font-bold">2,432</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Tâches créées</p>
                <p className="text-3xl font-bold">648</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <BarChart3 className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Taux de complétion</p>
                <p className="text-3xl font-bold">87%</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <PieChart className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activités par jour</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder type="bar" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Utilisation par module</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder type="pie" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des tâches</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder type="line" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Activité utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder type="bar" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
