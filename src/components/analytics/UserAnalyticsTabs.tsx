
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface UserAnalyticsTabsProps {
  timeRange: number;
  analyticsData: any;
  isLoading: boolean;
}

const UserAnalyticsTabs: React.FC<UserAnalyticsTabsProps> = ({ 
  timeRange, 
  analyticsData, 
  isLoading 
}) => {
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
            ) : (
              <div className="h-[350px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-slate-500">Graphique de croissance des utilisateurs sur {timeRange} jours</p>
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
            ) : (
              <div className="h-[350px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-slate-500">Graphique d'activité utilisateur sur {timeRange} jours</p>
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
            ) : (
              <div className="h-[350px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-slate-500">Graphique de statut des utilisateurs</p>
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
            ) : (
              <div className="h-[350px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-slate-500">Graphique de distribution des abonnements</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserAnalyticsTabs;
