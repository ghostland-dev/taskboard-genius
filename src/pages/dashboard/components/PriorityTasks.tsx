
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTasks, Task, TaskCategory } from "@/contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronRight, CheckCircle, CheckCircle2, Repeat } from "lucide-react";

const PriorityTasks: React.FC = () => {
  const { tasks } = useTasks();
  const navigate = useNavigate();

  // Tasks filtered by priority
  const highPriorityTasks = tasks.filter((task) => task.priority === "high" && task.status !== "completed");

  // Get category names in French
  const getCategoryName = (category: TaskCategory): string => {
    switch (category) {
      case "health": return "Santé";
      case "work": return "Travail";
      case "school": return "Scolaire";
      case "legal": return "Légal";
      case "personal": return "Personnel";
      case "other": return "Autre";
      default: return category;
    }
  };

  return (
    <Card className="lg:col-span-2 border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Tâches prioritaires</CardTitle>
          <CardDescription>Les tâches à traiter en urgence</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          className="text-primary"
          onClick={() => navigate("/tasks")}
        >
          Voir tout
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {highPriorityTasks.length > 0 ? (
          <div className="space-y-3">
            {highPriorityTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <CheckCircle2 
                      size={20} 
                      className="text-slate-300 hover:text-green-500 cursor-pointer transition-colors" 
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{task.title}</h4>
                    <div className="flex items-center flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className={`
                        ${task.category === "health" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        task.category === "work" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        task.category === "school" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        task.category === "legal" ? "bg-gray-50 text-gray-700 border-gray-200" :
                        task.category === "personal" ? "bg-green-50 text-green-700 border-green-200" :
                        "bg-slate-50 text-slate-700 border-slate-200"
                      }`}>
                        {getCategoryName(task.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {task.dueDate
                          ? `Échéance: ${formatDistance(new Date(task.dueDate), new Date(), {
                              addSuffix: true,
                              locale: fr,
                            })}`
                          : "Sans échéance"}
                      </span>
                      {task.repeats !== "none" && (
                        <span className="flex items-center text-xs text-primary">
                          <Repeat size={12} className="mr-1" />
                          {task.repeats === "daily" 
                            ? "Quotidien" 
                            : task.repeats === "weekly"
                            ? "Hebdomadaire"
                            : task.repeats === "monthly"
                            ? "Mensuel"
                            : "Annuel"
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className="bg-red-500 hover:bg-red-600">Haute priorité</Badge>
              </div>
            ))}
            {highPriorityTasks.length > 5 && (
              <div className="text-center pt-2">
                <Button 
                  variant="ghost" 
                  className="text-primary"
                  onClick={() => navigate("/tasks")}
                >
                  Voir {highPriorityTasks.length - 5} tâches supplémentaires
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 flex flex-col items-center justify-center h-40">
            <CheckCircle className="h-10 w-10 text-slate-200 mb-4" />
            <p className="text-muted-foreground font-medium">Aucune tâche prioritaire pour le moment</p>
            <p className="text-sm text-muted-foreground">Vous êtes à jour avec vos tâches importantes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriorityTasks;
