
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks } from "@/contexts/TaskContext";
import { CheckCircle, Clock, AlertCircle, CalendarDays } from "lucide-react";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

const Dashboard: React.FC = () => {
  const { tasks } = useTasks();

  // Task counts
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress").length;
  const dueSoonTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    return dueDate <= threeDaysFromNow && dueDate >= now;
  }).length;

  // Tasks filtered by priority
  const highPriorityTasks = tasks.filter((task) => task.priority === "high");
  const recentTasks = [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-heading">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de vos tâches et activités
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Tâches totales</p>
                <p className="text-3xl font-bold">{totalTasks}</p>
              </div>
              <div className="bg-brand-100 p-3 rounded-full">
                <CalendarDays className="text-brand-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Tâches terminées</p>
                <p className="text-3xl font-bold">{completedTasks}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">En cours</p>
                <p className="text-3xl font-bold">{inProgressTasks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Échéances proches</p>
                <p className="text-3xl font-bold">{dueSoonTasks}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tâches prioritaires</CardTitle>
          </CardHeader>
          <CardContent>
            {highPriorityTasks.length > 0 ? (
              <div className="space-y-4">
                {highPriorityTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`task-tag task-category-${task.category}`}>
                          {task.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {task.dueDate
                            ? `Échéance: ${formatDistance(new Date(task.dueDate), new Date(), {
                                addSuffix: true,
                                locale: fr,
                              })}`
                            : "Sans échéance"}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`task-tag task-priority-${task.priority}`}
                    >
                      {task.priority === "high"
                        ? "Haute"
                        : task.priority === "medium"
                        ? "Moyenne"
                        : "Basse"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune tâche prioritaire pour le moment.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tâches récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistance(new Date(task.createdAt), new Date(), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      task.status === "completed"
                        ? "bg-green-500"
                        : task.status === "inprogress"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  ></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
