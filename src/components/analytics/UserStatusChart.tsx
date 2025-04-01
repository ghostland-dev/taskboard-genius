
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";

interface UserStatusData {
  name: string;
  value: number;
}

const UserStatusChart: React.FC = () => {
  const [statusData, setStatusData] = useState<UserStatusData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("status");

        if (error) {
          throw error;
        }

        if (data) {
          // Compter les occurrences de chaque statut
          const statusCounts = data.reduce((acc, item) => {
            const status = item.status || "unknown";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          // Convertir en format adapté au graphique
          const chartData = Object.entries(statusCounts).map(([name, value]) => ({
            name: name === "active" ? "Actif" : 
                  name === "inactive" ? "Inactif" : 
                  name === "suspended" ? "Suspendu" : 
                  name === "unknown" ? "Inconnu" : name,
            value
          }));

          setStatusData(chartData);
        }
      } catch (err) {
        console.error("Error fetching user status data:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || statusData.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        {error || "Aucune donnée disponible"}
      </div>
    );
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

  const total = statusData.reduce((sum, item) => sum + item.value, 0);

  // Ajouter le pourcentage pour chaque statut
  const dataWithPercentage = statusData.map(item => ({
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
