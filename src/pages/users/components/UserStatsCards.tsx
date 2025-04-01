
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

type UserStatsProps = {
  stats: {
    total: number;
    active: number;
    premium: number;
  };
};

const UserStatsCards = ({ stats }: UserStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total utilisateurs</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-brand-100 p-3 rounded-full">
              <User className="text-brand-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Utilisateurs actifs</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <User className="text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Abonnés premium</p>
              <p className="text-3xl font-bold">{stats.premium}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <User className="text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsCards;
