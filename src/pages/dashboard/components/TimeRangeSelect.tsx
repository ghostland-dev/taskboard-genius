
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRangeSelectProps {
  timeRange: "today" | "week" | "month";
  setTimeRange: (value: "today" | "week" | "month") => void;
}

export const TimeRangeSelect: React.FC<TimeRangeSelectProps> = ({ timeRange, setTimeRange }) => {
  return (
    <Select value={timeRange} onValueChange={(value) => setTimeRange(value as "today" | "week" | "month")}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Période" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">Aujourd'hui</SelectItem>
        <SelectItem value="week">Cette semaine</SelectItem>
        <SelectItem value="month">Ce mois</SelectItem>
      </SelectContent>
    </Select>
  );
};
