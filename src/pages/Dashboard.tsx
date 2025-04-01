
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks, Task, TaskCategory } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  CalendarDays, 
  Repeat,
  Users,
  ArrowUpRight
} from "lucide-react";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("week");

  // Task counts
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress").length;
  const pendingTasks = tasks.filter((task) => task.status === "todo").length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Recurring tasks
  const recurringTasks = tasks.filter((task) => task.repeats !== "none");
  const dailyTasks = tasks.filter((task) => task.repeats === "daily").length;
  const weeklyTasks = tasks.filter((task) => task.repeats === "weekly").length;
  const monthlyTasks = tasks.filter((task) => task.repeats === "monthly").length;
  const yearlyTasks = tasks.filter((task) => task.repeats === "yearly").length;

  // Due soon tasks
  const dueSoonTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    return dueDate <= threeDaysFromNow && dueDate >= now && task.status !== "completed";
  });

  // Tasks filtered by priority
  const highPriorityTasks = tasks.filter((task) => task.priority === "high" && task.status !== "completed");
  const recentTasks = [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  // Tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<TaskCategory, Task[]>);

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
  const filteredCompletionRate = filteredTasks.length 
    ? Math.round((filteredTasks.filter(t => t.status === "completed").length / filteredTasks.length) * 100)
    : 0;

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue {user?.name || ""}. Voici la vue d'ensemble de vos tâches et activités
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as "today" | "week" | "month")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={() => navigate("/tasks")}
            className="bg-brand-500 hover:bg-brand-600"
          >
            <ArrowUpRight className="mr-1 h-4 w-4" />
            Voir toutes les tâches
          </Button>
        </div>
      </div>

      {!user?.role && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Période d'essai</AlertTitle>
          <AlertDescription>
            Vous êtes actuellement en période d'essai. Pour débloquer toutes les fonctionnalités, 
            passez à un abonnement payant dans les paramètres.
          </AlertDescription>
        </Alert>
      )}

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
                <div className="mt-2">
                  <Progress value={completionRate} className="h-2" />
                  <span className="text-xs text-muted-foreground">{completionRate}% complétés</span>
                </div>
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
                <p className="text-3xl font-bold">{dueSoonTasks.length}</p>
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
            <CardDescription>Les tâches à traiter en urgence</CardDescription>
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
                        <Badge variant="outline" className={`bg-opacity-20 ${
                          task.category === "health" ? "bg-red-100 text-red-700 border-red-200" :
                          task.category === "work" ? "bg-blue-100 text-blue-700 border-blue-200" :
                          task.category === "school" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                          task.category === "legal" ? "bg-purple-100 text-purple-700 border-purple-200" :
                          task.category === "personal" ? "bg-green-100 text-green-700 border-green-200" :
                          "bg-gray-100 text-gray-700 border-gray-200"
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
                          <span className="flex items-center text-xs text-brand-600">
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
                    <Badge className="bg-red-500">Haute priorité</Badge>
                  </div>
                ))}
                {highPriorityTasks.length > 5 && (
                  <Button 
                    variant="link" 
                    className="w-full" 
                    onClick={() => navigate("/tasks")}
                  >
                    Voir toutes les tâches prioritaires ({highPriorityTasks.length})
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune tâche prioritaire pour le moment.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tâches récurrentes</CardTitle>
            <CardDescription>Activités régulières planifiées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recurringTasks.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center bg-blue-50 p-3 rounded-lg">
                      <span className="text-2xl font-bold text-blue-600">{dailyTasks}</span>
                      <span className="text-sm text-muted-foreground">Quotidiennes</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-green-50 p-3 rounded-lg">
                      <span className="text-2xl font-bold text-green-600">{weeklyTasks}</span>
                      <span className="text-sm text-muted-foreground">Hebdomadaires</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-yellow-50 p-3 rounded-lg">
                      <span className="text-2xl font-bold text-yellow-600">{monthlyTasks}</span>
                      <span className="text-sm text-muted-foreground">Mensuelles</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-purple-50 p-3 rounded-lg">
                      <span className="text-2xl font-bold text-purple-600">{yearlyTasks}</span>
                      <span className="text-sm text-muted-foreground">Annuelles</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Prochaines tâches récurrentes</h4>
                    {recurringTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium truncate text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.repeats === "daily" 
                              ? "Tous les jours" 
                              : task.repeats === "weekly"
                              ? "Toutes les semaines"
                              : task.repeats === "monthly"
                              ? "Tous les mois"
                              : "Tous les ans"
                            }
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
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Repeat className="mx-auto h-12 w-12 opacity-20 mb-2" />
                  <p>Aucune tâche récurrente</p>
                  <p className="text-sm">Créez des tâches avec répétition pour les voir apparaître ici</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Répartition par catégorie</CardTitle>
                <CardDescription>Vue d'ensemble de vos tâches par type</CardDescription>
              </div>
              <Badge variant="outline">{timeRange === "today" ? "Aujourd'hui" : timeRange === "week" ? "7 derniers jours" : "30 derniers jours"}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(tasksByCategory).map(([category, categoryTasks]) => {
                const categoryCompletionRate = categoryTasks.length 
                  ? Math.round((categoryTasks.filter(t => t.status === "completed").length / categoryTasks.length) * 100)
                  : 0;
                
                return (
                  <div 
                    key={category}
                    className="border rounded-lg p-4 flex flex-col" 
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{getCategoryName(category as TaskCategory)}</h3>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Dernières tâches créées ou modifiées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDistance(new Date(task.createdAt), new Date(), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName(task.category)}
                      </Badge>
                    </div>
                  </div>
                  <span
                    className={`h-3 w-3 rounded-full ${
                      task.status === "completed"
                        ? "bg-green-500"
                        : task.status === "inprogress"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  ></span>
                </div>
              ))}
              {recentTasks.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Aucune activité récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {user?.role === "superadmin" && (
        <Card>
          <CardHeader>
            <CardTitle>Administration</CardTitle>
            <CardDescription>Statistiques globales et gestion des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-medium">Utilisateurs du système</p>
                <p className="text-muted-foreground">En tant que super admin, vous pouvez gérer tous les utilisateurs</p>
              </div>
              <Button 
                onClick={() => navigate("/users")}
                className="bg-brand-500 hover:bg-brand-600"
              >
                <Users className="mr-2 h-4 w-4" />
                Gérer les utilisateurs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
