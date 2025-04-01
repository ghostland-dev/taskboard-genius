
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format, subDays } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface UserActivityChartProps {
  timeRange: number; // Number of days to look back
}

const UserActivityChart: React.FC<UserActivityChartProps> = ({ timeRange }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would fetch actual login/activity data
        // For this demo, we'll generate mock data
        const endDate = new Date();
        const startDate = subDays(endDate, timeRange);
        
        // Generate daily activity data with random values
        const activityData = [];
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          const dateStr = format(currentDate, "yyyy-MM-dd");
          
          // Generate random values for demonstration
          const logins = Math.floor(Math.random() * 50) + 10;
          const actions = Math.floor(Math.random() * 200) + 30;
          
          activityData.push({
            date: dateStr,
            logins: logins,
            actions: actions
          });
          
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setData(activityData);
      } catch (error) {
        console.error("Error generating activity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <p className="ml-2">Chargement des données d'activité...</p>
      </div>
    );
  }

  if (!data.length) {
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
