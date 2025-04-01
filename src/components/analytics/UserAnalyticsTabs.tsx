
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import UserGrowthChart from "./UserGrowthChart";
import UserActivityChart from "./UserActivityChart";
import UserStatusChart from "./UserStatusChart";
import SubscriptionDistribution from "./SubscriptionDistribution";

interface UserAnalyticsTabsProps {
  timeRange: number;
  analyticsData: any;
  isLoading: boolean;
  error: string | null;
}

const UserAnalyticsTabs: React.FC<UserAnalyticsTabsProps> = ({ 
  timeRange, 
  analyticsData, 
  isLoading,
  error
}) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue="growth" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="growth">Croissance</TabsTrigger>
        <TabsTrigger value="activity">Activité</TabsTrigger>
        <TabsTrigger value="status">Statut</TabsTrigger>
        <TabsTrigger value="subscription">Abonnements</TabsTrigger>
      </TabsList>
      
      <TabsContent value="growth">
        <Card>
          <CardHeader>
            <CardTitle>Croissance des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : analyticsData.growthData && analyticsData.growthData.length > 0 ? (
              <div className="h-[350px]">
                <UserGrowthChart data={analyticsData.growthData} />
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-slate-500">Aucune donnée de croissance disponible pour {timeRange} jours</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle>Activité utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : analyticsData.activityData && analyticsData.activityData.length > 0 ? (
              <div className="h-[350px]">
                <UserActivityChart data={analyticsData.activityData} />
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-slate-500">Aucune donnée d'activité disponible pour {timeRange} jours</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="status">
        <Card>
          <CardHeader>
            <CardTitle>Statut des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : analyticsData.statusData && analyticsData.statusData.length > 0 ? (
              <div className="h-[350px]">
                <UserStatusChart data={analyticsData.statusData} />
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-slate-500">Aucune donnée de statut disponible</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="subscription">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des abonnements</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : analyticsData.subscriptionData && analyticsData.subscriptionData.length > 0 ? (
              <div className="h-[350px]">
                <SubscriptionDistribution data={analyticsData.subscriptionData} />
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-slate-500">Aucune donnée d'abonnement disponible</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserAnalyticsTabs;
