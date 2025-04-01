
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCcw } from "lucide-react";

interface UserAnalyticsHeaderProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const UserAnalyticsHeader: React.FC<UserAnalyticsHeaderProps> = ({ 
  timeRange, 
  onTimeRangeChange,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold gradient-heading">Analyse des utilisateurs</h1>
        <p className="text-muted-foreground mt-1">
          Consultez les statistiques détaillées sur vos utilisateurs
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Select value={timeRange} onValueChange={onTimeRangeChange} disabled={isLoading}>
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
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          title="Rafraîchir les données"
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default UserAnalyticsHeader;
