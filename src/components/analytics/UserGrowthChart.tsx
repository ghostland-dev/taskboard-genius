import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format, subDays } from "date-fns";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface UserGrowthChartProps {
  timeRange: number; // Number of days to look back
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ timeRange }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGrowthData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be a more sophisticated query 
        // that groups by date to show daily growth
        const { data: profiles } = await supabase
          .from("profiles")
          .select("created_at")
          .order("created_at", { ascending: true });

        if (profiles && profiles.length > 0) {
          // Generate date points for the last N days
          const endDate = new Date();
          const startDate = subDays(endDate, timeRange);
          
          // Initialize array with one entry per day in the time range
          const dailyData: Record<string, any>[] = [];
          let currentDate = new Date(startDate);
          
          // Create entry for each day with initial count of 0
          while (currentDate <= endDate) {
            const dateStr = format(currentDate, "yyyy-MM-dd");
            dailyData.push({
              date: dateStr,
              users: 0,
              newUsers: 0,
              cumulative: 0
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          // Count users created each day
          profiles.forEach(profile => {
            const createdDate = format(new Date(profile.created_at), "yyyy-MM-dd");
            const existingEntry = dailyData.find(entry => entry.date === createdDate);
            
            if (existingEntry) {
              existingEntry.newUsers += 1;
            }
          });
          
          // Calculate cumulative growth
          let cumulativeCount = 0;
          dailyData.forEach((day, index) => {
            cumulativeCount += day.newUsers;
            day.cumulative = cumulativeCount;
            // For better visualization, keep track of both new and total
            day.users = cumulativeCount;
          });
          
          setData(dailyData);
        }
      } catch (error) {
        console.error("Error fetching user growth data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGrowthData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <p className="ml-2">Chargement des données...</p>
      </div>
    );
  }

  if (!data.length) {
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
