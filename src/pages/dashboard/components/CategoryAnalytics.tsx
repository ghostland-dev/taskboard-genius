
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Task, TaskCategory } from "@/contexts/TaskContext";

interface CategoryAnalyticsProps {
  tasks: Task[];
}

export const CategoryAnalytics: React.FC<CategoryAnalyticsProps> = ({ tasks }) => {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("week");
  
  // Time-based filtering for the analytics
  const getFilteredTasks = () => {
    const now = new Date();
    const startDate = new Date();
    
    if (timeRange === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === "month") {
      startDate.setMonth(now.getMonth() - 1);
    }
    
    return tasks.filter(task => new Date(task.createdAt) >= startDate);
  };

  const filteredTasks = getFilteredTasks();
  const totalTasks = tasks.length;
  
  // Tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<TaskCategory, Task[]>);

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

  // For the demo: mock analytics data
  const categoryColors = {
    health: "bg-blue-500",
    work: "bg-purple-500",
    school: "bg-yellow-500",
    legal: "bg-gray-500",
    personal: "bg-green-500",
    other: "bg-slate-500"
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Répartition par catégorie
            </CardTitle>
            <CardDescription>Vue d'ensemble de vos tâches par type</CardDescription>
          </div>
          <Badge variant="outline">{timeRange === "today" ? "Aujourd'hui" : timeRange === "week" ? "7 derniers jours" : "30 derniers jours"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Categories chart */}
          <div className="col-span-3 h-52 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-8 border-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{totalTasks}</div>
                  <div className="text-sm text-muted-foreground">Total des tâches</div>
                </div>
              </div>
              {Object.entries(tasksByCategory).length > 0 ? (
                <>
                  {Object.entries(tasksByCategory).map(([category, tasks], index) => {
                    const percentage = Math.round((tasks.length / totalTasks) * 100);
                    const rotation = index * (360 / Object.entries(tasksByCategory).length);
                    return (
                      <div
                        key={category}
                        className={`absolute w-3 h-3 rounded-full ${(categoryColors as any)[category]} transform -translate-x-1/2 -translate-y-1/2`}
                        style={{
                          top: `calc(50% + ${Math.sin((rotation * Math.PI) / 180) * 80}px)`,
                          left: `calc(50% + ${Math.cos((rotation * Math.PI) / 180) * 80}px)`,
                        }}
                      >
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium"
                          style={{
                            marginLeft: `${Math.cos((rotation * Math.PI) / 180) * 25}px`,
                            marginTop: `${Math.sin((rotation * Math.PI) / 180) * 25}px`,
                          }}
                        >
                          {getCategoryName(category as TaskCategory)} ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>Aucune donnée disponible</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Categories stats */}
          <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(tasksByCategory).map(([category, categoryTasks]) => {
              const categoryCompletionRate = categoryTasks.length 
                ? Math.round((categoryTasks.filter(t => t.status === "completed").length / categoryTasks.length) * 100)
                : 0;
              
              return (
                <div 
                  key={category}
                  className="border rounded-lg p-4 flex flex-col hover:border-primary/20 transition-colors" 
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${(categoryColors as any)[category]}`}></div>
                      {getCategoryName(category as TaskCategory)}
                    </h3>
                    <span className="text-sm text-muted-foreground">{categoryTasks.length}</span>
                  </div>
                  
                  <div className="mt-1 mb-3">
                    <Progress value={categoryCompletionRate} className="h-2" />
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex items-center justify-between mt-auto">
                    <span>{categoryCompletionRate}% complété</span>
                    <span>
                      {categoryTasks.filter(t => t.status === "completed").length}/{categoryTasks.length} tâches
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
