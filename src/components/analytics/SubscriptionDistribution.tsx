
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface SubscriptionDataPoint {
  name: string;
  value: number;
  percentage?: number;
}

interface SubscriptionDistributionProps {
  data: SubscriptionDataPoint[];
}

const SubscriptionDistribution: React.FC<SubscriptionDistributionProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-8">Aucune donnée d'abonnement disponible.</div>;
  }

  // Calculate percentages for the chart
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  // Configuration for the chart theme
  const chartConfig = {
    Premium: {
      label: "Premium",
      theme: {
        light: "#8884d8",
        dark: "#9b93e8"
      }
    },
    Standard: {
      label: "Standard",
      theme: {
        light: "#82ca9d",
        dark: "#91dcad"
      }
    },
    Essai: {
      label: "Essai",
      theme: {
        light: "#ffc658",
        dark: "#ffd279"
      }
    }
  };

  return (
    <ChartContainer config={chartConfig} className="w-full aspect-[1.5/1] max-h-full">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          innerRadius={50} 
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percentage }) => `${name}: ${percentage}%`}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`var(--color-${entry.name})`}
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="font-medium">{data.name}</div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <span className="text-muted-foreground text-xs">Utilisateurs:</span>
                    <span className="font-medium">{data.value}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground text-xs">Pourcentage:</span>
                    <span className="font-medium">{data.percentage}%</span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
};

export default SubscriptionDistribution;
