
import React from "react";
import { format } from "date-fns";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface GrowthDataPoint {
  date: string;
  cumulative: number;
  newUsers: number;
}

interface UserGrowthChartProps {
  data: GrowthDataPoint[];
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-8">Aucune donnée disponible pour cette période.</div>;
  }

  const chartConfig = {
    cumulative: {
      label: "Total des utilisateurs",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))"
      }
    },
    newUsers: {
      label: "Nouveaux utilisateurs",
      theme: {
        light: "hsl(var(--success))",
        dark: "hsl(var(--success))"
      }
    }
  };

  return (
    <ChartContainer config={chartConfig} className="w-full aspect-[1.5/1] max-h-full">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => format(new Date(date), "dd/MM")}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="cumulative"
          name="Total utilisateurs"
          stroke="var(--color-cumulative)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="newUsers"
          name="Nouveaux utilisateurs"
          stroke="var(--color-newUsers)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="font-medium">{format(new Date(label), "dd/MM/yyyy")}</div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Total</span>
            <span className="font-medium">{payload[0].value}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Nouveaux</span>
            <span className="font-medium">{payload[1].value}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default UserGrowthChart;
