
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "@/contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronRight, Calendar } from "lucide-react";

const UpcomingDeadlines: React.FC = () => {
  const { tasks } = useTasks();
  const navigate = useNavigate();

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
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Planning</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>Prochaines échéances</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary p-0 h-auto"
            onClick={() => navigate("/calendar")}
          >
            Calendrier
            <Calendar className="ml-1 h-4 w-4" />
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {dueSoonTasks.length > 0 ? (
          <div className="space-y-4">
            {dueSoonTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="border-l-4 border-primary pl-3 py-1">
                <p className="font-medium">{task.title}</p>
                <div className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>
                    {task.dueDate && formatDistance(new Date(task.dueDate), new Date(), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                  <Badge
                    variant="outline"
                    className={`
                      ${task.priority === "high" 
                        ? "bg-red-50 text-red-700 border-red-200" 
                        : task.priority === "medium"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-green-50 text-green-700 border-green-200"
                      }
                    `}
                  >
                    {task.priority === "high" 
                      ? "Haute" 
                      : task.priority === "medium" 
                      ? "Moyenne" 
                      : "Basse"}
                  </Badge>
                </div>
              </div>
            ))}
            
            <div className="pt-2 text-center">
              <Button 
                variant="outline"
                className="w-full text-primary border-primary/30 hover:bg-primary/5"
                onClick={() => navigate("/calendar")}
              >
                Voir toutes les échéances
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8 h-40">
            <Calendar className="h-10 w-10 text-slate-200 mb-4" />
            <p className="text-muted-foreground font-medium">Aucune échéance proche</p>
            <p className="text-sm text-muted-foreground">Profitez de ce moment de calme</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
