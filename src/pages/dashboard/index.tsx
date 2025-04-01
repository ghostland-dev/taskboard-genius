
import React, { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useTasks } from "@/contexts/TaskContext";
import { PlusCircle, Activity } from "lucide-react";

// Import dashboard components
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsOverview } from "./components/StatsOverview";
import { PriorityTasks } from "./components/PriorityTasks";
import { UpcomingCalendar } from "./components/UpcomingCalendar";
import { CategoryAnalytics } from "./components/CategoryAnalytics";
import { AdminSection } from "./components/AdminSection";
import { TimeRangeSelect } from "./components/TimeRangeSelect";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("week");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex-1">
          <DashboardHeader user={user} />
        </div>
        <div className="mt-4 sm:mt-0">
          <TimeRangeSelect 
            timeRange={timeRange} 
            setTimeRange={setTimeRange} 
          />
        </div>
      </div>

      {/* Stats overview */}
      <StatsOverview tasks={tasks} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PriorityTasks tasks={tasks} />
        <UpcomingCalendar tasks={tasks} />
      </div>

      {/* Analytics section */}
      <CategoryAnalytics tasks={tasks} />

      {/* Admin section */}
      <AdminSection user={user} />
    </div>
  );
};

export default Dashboard;
