
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

const UserSummaryCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Gestion des utilisateurs</p>
            <p className="text-3xl font-bold">Administration</p>
          </div>
          <div className="bg-brand-100 p-3 rounded-full">
            <User className="text-brand-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSummaryCard;
