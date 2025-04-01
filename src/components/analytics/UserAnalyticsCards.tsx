
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, UserCheck, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserAnalyticsCardsProps {
  data: any;  // Type à définir selon la structure des données
  isLoading?: boolean;
}

const UserAnalyticsCards: React.FC<UserAnalyticsCardsProps> = ({ data, isLoading = false }) => {
  // Valeurs fictives pour la démo
  const stats = {
    totalUsers: data?.totalUsers || 128,
    activeUsers: data?.activeUsers || 89,
    retentionRate: data?.retentionRate || "76%",
    avgSessionTime: data?.avgSessionTime || "24 min"
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Utilisateurs totaux</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
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
              <p className="text-3xl font-bold">{stats.activeUsers}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCheck className="text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Taux de rétention</p>
              <p className="text-3xl font-bold">{stats.retentionRate}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Temps moyen</p>
              <p className="text-3xl font-bold">{stats.avgSessionTime}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalyticsCards;
