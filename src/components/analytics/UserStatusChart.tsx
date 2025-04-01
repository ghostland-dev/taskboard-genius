
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface StatusDataPoint {
  name: string;
  value: number;
  percentage?: number;
}

interface UserStatusChartProps {
  data: StatusDataPoint[];
}

const UserStatusChart: React.FC<UserStatusChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-8">Aucune donnée de statut disponible.</div>;
  }

  const COLORS = ['#10b981', '#6366f1', '#f43f5e', '#f59e0b'];

  const chartConfig = {
    Actif: {
      label: "Actif",
      theme: {
        light: "#10b981",  // vert
        dark: "#34d399"
      }
    },
    Inactif: {
      label: "Inactif",
      theme: {
        light: "#6366f1",  // indigo
        dark: "#818cf8"
      }
    },
    Suspendu: {
      label: "Suspendu",
      theme: {
        light: "#f43f5e",  // rouge
        dark: "#fb7185"
      }
    },
    Inconnu: {
      label: "Inconnu",
      theme: {
        light: "#f59e0b",  // ambre
        dark: "#fbbf24"
      }
    }
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Ajouter le pourcentage pour chaque statut
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: Math.round((item.value / total) * 100)
  }));

  return (
    <ChartContainer config={chartConfig} className="w-full aspect-[1.5/1] max-h-full">
      <PieChart>
        <Pie
          data={dataWithPercentage}
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
          {dataWithPercentage.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

export default UserStatusChart;
