
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const UserStatusChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusData = async () => {
      setLoading(true);
      
      try {
        // Fetch users from Supabase and group by status
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("status");
          
        if (error) throw error;
        
        if (profiles) {
          // Count occurrences of each status
          const statusCounts: Record<string, number> = {};
          
          profiles.forEach(profile => {
            const status = profile.status || "unknown";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
          });
          
          // Convert to chart data format
          const chartData = Object.entries(statusCounts).map(([status, count]) => ({
            name: status === "active" ? "Actif" : 
                  status === "inactive" ? "Inactif" : 
                  status === "suspended" ? "Suspendu" : "Inconnu",
            value: count
          }));
          
          setData(chartData);
        }
      } catch (error) {
        console.error("Error fetching user status data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <p className="ml-2">Chargement des statuts utilisateur...</p>
      </div>
    );
  }

  if (!data.length) {
    return <div className="text-center p-8">Aucune donnée de statut disponible.</div>;
  }

  // Calculate percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
  }));

  // Configuration for chart colors based on status
  const chartConfig = {
    Actif: {
      label: "Utilisateurs actifs",
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    },
    Inactif: {
      label: "Utilisateurs inactifs",
      theme: {
        light: "#f59e0b",
        dark: "#fbbf24"
      }
    },
    Suspendu: {
      label: "Utilisateurs suspendus",
      theme: {
        light: "#ef4444",
        dark: "#f87171"
      }
    },
    Inconnu: {
      label: "Statut inconnu",
      theme: {
        light: "#6b7280",
        dark: "#9ca3af"
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
          outerRadius={80}
          innerRadius={40}
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

export default UserStatusChart;
