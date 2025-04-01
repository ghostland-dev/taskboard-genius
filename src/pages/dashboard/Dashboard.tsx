
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import DashboardStats from "./components/DashboardStats";
import PriorityTasks from "./components/PriorityTasks";
import UpcomingDeadlines from "./components/UpcomingDeadlines";
import CategoryAnalytics from "./components/CategoryAnalytics";
import AdminSection from "./components/AdminSection";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("week");

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

      {!user?.role && (
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
      )}

      {/* Stats overview */}
      <DashboardStats timeRange={timeRange} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Tasks */}
        <PriorityTasks />
        
        {/* Upcoming Deadlines */}
        <UpcomingDeadlines />
      </div>

      {/* Analytics section */}
      <CategoryAnalytics timeRange={timeRange} />

      {/* Admin section - only shown for superadmins */}
      {user?.role === "superadmin" && <AdminSection />}
    </div>
  );
};

export default Dashboard;
