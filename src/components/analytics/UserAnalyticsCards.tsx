
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, PieChart } from "lucide-react";
import { UserStats } from "@/types/user";

interface UserAnalyticsCardsProps {
  data: UserStats;
}

const UserAnalyticsCards: React.FC<UserAnalyticsCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total des utilisateurs</p>
              <p className="text-3xl font-bold">{data.totalUsers}</p>
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
              <p className="text-3xl font-bold">{data.activeUsers}</p>
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
              <p className="text-3xl font-bold">{data.premiumUsers}</p>
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
              <p className="text-3xl font-bold">{data.newUsersThisMonth}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Users className="text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalyticsCards;
