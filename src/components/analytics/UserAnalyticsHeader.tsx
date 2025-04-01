
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
          Consultez les statistiques détaillées sur vos utilisateurs
        </p>
      </div>
      <Select value={timeRange} onValueChange={onTimeRangeChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Période" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">7 jours</SelectItem>
          <SelectItem value="30">30 jours</SelectItem>
          <SelectItem value="90">90 jours</SelectItem>
          <SelectItem value="365">365 jours</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserAnalyticsHeader;
