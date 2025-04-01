
import React from "react";
import { format } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface ActivityDataPoint {
  date: string;
  logins: number;
  actions: number;
}

interface UserActivityChartProps {
  data: ActivityDataPoint[];
}

const UserActivityChart: React.FC<UserActivityChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-8">Aucune donnée d'activité disponible pour cette période.</div>;
  }

  const chartConfig = {
    logins: {
      label: "Connexions",
      theme: {
        light: "#2563eb",
        dark: "#3b82f6"
      }
    },
    actions: {
      label: "Actions",
      theme: {
        light: "#16a34a",
        dark: "#22c55e"
      }
    }
  };

  return (
    <ChartContainer config={chartConfig} className="w-full aspect-[1.5/1] max-h-full">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => format(new Date(date), "dd/MM")}
        />
        <YAxis />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="font-medium">{format(new Date(label), "dd/MM/yyyy")}</div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <span className="text-muted-foreground text-xs">Connexions:</span>
                    <span className="font-medium">{payload[0].value}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground text-xs">Actions:</span>
                    <span className="font-medium">{payload[1].value}</span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Bar dataKey="logins" name="Connexions" fill="var(--color-logins)" />
        <Bar dataKey="actions" name="Actions" fill="var(--color-actions)" />
      </BarChart>
    </ChartContainer>
  );
};

export default UserActivityChart;
