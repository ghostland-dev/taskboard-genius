
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import UserGrowthChart from "@/components/analytics/UserGrowthChart";
import SubscriptionDistribution from "@/components/analytics/SubscriptionDistribution";
import UserActivityChart from "@/components/analytics/UserActivityChart";
import UserStatusChart from "@/components/analytics/UserStatusChart";
import { UserStats } from "@/types/user";

interface UserAnalyticsTabsProps {
  timeRange: number;
  analyticsData: UserStats;
}

const UserAnalyticsTabs: React.FC<UserAnalyticsTabsProps> = ({ 
  timeRange, 
  analyticsData 
}) => {
  return (
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
              <UserGrowthChart timeRange={timeRange} />
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
              <UserActivityChart timeRange={timeRange} />
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
  );
};

export default UserAnalyticsTabs;
