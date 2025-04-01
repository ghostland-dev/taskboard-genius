
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, CheckCircle, Clock, AlertCircle, Activity } from "lucide-react"; // Added Activity import
import { Task } from "@/contexts/TaskContext";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

interface StatsOverviewProps {
  tasks: Task[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ tasks }) => {
  // Task counts
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress").length;
  const pendingTasks = tasks.filter((task) => task.status === "todo").length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Due soon tasks
  const dueSoonTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    return dueDate <= threeDaysFromNow && dueDate >= now && task.status !== "completed";
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-none shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Tâches totales</p>
              <p className="text-3xl font-bold">{totalTasks}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <CalendarDays className="text-primary" />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
            <span>À faire: {pendingTasks}</span>
            <span>En cours: {inProgressTasks}</span>
            <span>Terminées: {completedTasks}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Taux de complétion</p>
              <p className="text-3xl font-bold">{completionRate}%</p>
              <div className="mt-2">
                <Progress value={completionRate} className="h-2" />
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">En cours</p>
              <p className="text-3xl font-bold">{inProgressTasks}</p>
              <div className="mt-2 text-sm text-muted-foreground flex items-center">
                <Activity className="h-4 w-4 mr-1" />
                <span>{inProgressTasks ? Math.round((inProgressTasks / totalTasks) * 100) : 0}% de vos tâches</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Échéances proches</p>
              <p className="text-3xl font-bold">{dueSoonTasks.length}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                Dans les 3 prochains jours
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertCircle className="text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
