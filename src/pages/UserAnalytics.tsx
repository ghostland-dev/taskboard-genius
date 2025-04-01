
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Users, TrendingUp, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import UserGrowthChart from "@/components/analytics/UserGrowthChart";
import SubscriptionDistribution from "@/components/analytics/SubscriptionDistribution";
import UserActivityChart from "@/components/analytics/UserActivityChart";
import UserStatusChart from "@/components/analytics/UserStatusChart";

const UserAnalytics: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getAllSubscriptions } = useSubscription();
  const [timeRange, setTimeRange] = useState<string>("30");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    standardUsers: 0,
    trialUsers: 0,
    newUsersThisMonth: 0
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from Supabase
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*");
          
        if (profiles) {
          const currentDate = new Date();
          const thirtyDaysAgo = new Date(currentDate);
          thirtyDaysAgo.setDate(currentDate.getDate() - 30);
          
          const active = profiles.filter(p => p.status === "active").length;
          const premium = profiles.filter(p => p.subscription === "premium").length;
          const standard = profiles.filter(p => p.subscription === "standard").length;
          const trial = profiles.filter(p => p.subscription === "trial").length;
          const newUsers = profiles.filter(p => {
            const createdAt = new Date(p.created_at);
            return createdAt >= thirtyDaysAgo;
          }).length;
          
          setAnalyticsData({
            totalUsers: profiles.length,
            activeUsers: active,
            premiumUsers: premium,
            standardUsers: standard,
            trialUsers: trial,
            newUsersThisMonth: newUsers
          });
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // If the user is not admin, redirect or show an access denied message
  if (user?.role !== "superadmin" && user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page. 
            Cette section est réservée aux administrateurs.
          </AlertDescription>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
          >
            Retour au tableau de bord
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Analyse des utilisateurs</h1>
          <p className="text-muted-foreground mt-1">
            Statistiques et tendances des utilisateurs de la plateforme
          </p>
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 derniers jours</SelectItem>
            <SelectItem value="30">30 derniers jours</SelectItem>
            <SelectItem value="90">90 derniers jours</SelectItem>
            <SelectItem value="365">Dernière année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total des utilisateurs</p>
                <p className="text-3xl font-bold">{analyticsData.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Utilisateurs actifs</p>
                <p className="text-3xl font-bold">{analyticsData.activeUsers}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Utilisateurs premium</p>
                <p className="text-3xl font-bold">{analyticsData.premiumUsers}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <PieChart className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Nouveaux utilisateurs</p>
                <p className="text-3xl font-bold">{analyticsData.newUsersThisMonth}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Users className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth" className="w-full">
        <TabsList>
          <TabsTrigger value="growth">Croissance</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="status">Statut</TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Croissance des utilisateurs</CardTitle>
              <CardDescription>
                Nouveaux utilisateurs sur la période sélectionnée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <UserGrowthChart timeRange={parseInt(timeRange)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des abonnements</CardTitle>
              <CardDescription>
                Répartition des utilisateurs par type d'abonnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <SubscriptionDistribution 
                  data={[
                    { name: 'Premium', value: analyticsData.premiumUsers },
                    { name: 'Standard', value: analyticsData.standardUsers },
                    { name: 'Essai', value: analyticsData.trialUsers }
                  ]} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activité des utilisateurs</CardTitle>
              <CardDescription>
                Nombre de connexions et d'actions par jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <UserActivityChart timeRange={parseInt(timeRange)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Statut des utilisateurs</CardTitle>
              <CardDescription>
                Répartition des utilisateurs par statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <UserStatusChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAnalytics;
