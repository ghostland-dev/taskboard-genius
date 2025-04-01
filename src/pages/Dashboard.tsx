import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Activity,
  ChevronRight,
  PlusCircle,
  Calendar,
  CheckCircle2
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  // For the demo: mock analytics data
  const categoryColors = {
    health: "bg-blue-500",
    work: "bg-purple-500",
    school: "bg-yellow-500",
    legal: "bg-gray-500",
    personal: "bg-green-500",
    other: "bg-slate-500"
  };

  // User welcome greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Bonjour";
    } else if (hour < 18) {
      return "Bon après-midi";
    } else {
      return "Bonsoir";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold gradient-heading">{getGreeting()}, {user?.name}</h1>
              <p className="text-muted-foreground mt-1">
                Voici la vue d'ensemble de vos tâches et activités
              </p>
            </div>
          </div>
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
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {!user?.subscription || user?.subscription === "trial" ? (
        <Alert className="bg-primary/5 border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle>Période d'essai</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>Vous êtes actuellement en période d'essai. Pour débloquer toutes les fonctionnalités, 
              passez à un abonnement payant.</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 border-primary text-primary hover:bg-primary/10"
              onClick={() => navigate('/settings')}
            >
              Voir les forfaits
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Abonnement {user.subscription === "premium" ? "Premium" : "Standard"} actif</AlertTitle>
          <AlertDescription>
            Vous bénéficiez de toutes les fonctionnalités de votre forfait {user.subscription === "premium" ? "Premium" : "Standard"}.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats overview */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      </div>

      {/* Analytics section */}
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

      {user?.role === "superadmin" && (
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Administration
            </CardTitle>
            <CardDescription>Statistiques globales et gestion des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">Gérer les utilisateurs</p>
                <p className="text-muted-foreground">En tant que super admin, vous pouvez gérer tous les utilisateurs</p>
              </div>
              <Button 
                onClick={() => navigate("/users")}
                className="bg-primary hover:bg-primary/90"
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
