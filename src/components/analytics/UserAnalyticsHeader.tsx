
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserAnalyticsHeaderProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

const UserAnalyticsHeader: React.FC<UserAnalyticsHeaderProps> = ({ 
  timeRange, 
  onTimeRangeChange 
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold gradient-heading">Analyse des utilisateurs</h1>
        <p className="text-muted-foreground mt-1">
          Statistiques et tendances des utilisateurs de la plateforme
        </p>
      </div>
      <Select
        value={timeRange}
        onValueChange={onTimeRangeChange}
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
  );
};

export default UserAnalyticsHeader;
