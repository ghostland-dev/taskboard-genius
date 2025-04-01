
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Bell, Search, Settings, LogOut, Menu, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Layout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const goToSettings = () => {
    navigate("/settings");
  };

  const goToProfile = () => {
    navigate("/settings?tab=account");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>
      
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-3 left-3 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <Sidebar collapsed={false} setCollapsed={() => {}} />
        </SheetContent>
      </Sheet>
      
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-white shadow-sm z-10 transition-all duration-200">
          <div className="flex-1 max-w-md md:ml-0 ml-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Rechercher..." 
                className="pl-9 bg-slate-50 border-none focus-visible:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <Badge className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="font-medium border-b p-3">Notifications</div>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="cursor-pointer p-3 hover:bg-slate-50 border-b">
                    <div className="font-medium">Nouvelle tâche assignée</div>
                    <div className="text-xs text-muted-foreground mt-1">Il y a 5 minutes</div>
                  </div>
                  <div className="cursor-pointer p-3 hover:bg-slate-50 border-b">
                    <div className="font-medium">Rappel: Tâche bientôt due</div>
                    <div className="text-xs text-muted-foreground mt-1">Il y a 30 minutes</div>
                  </div>
                  <div className="cursor-pointer p-3 hover:bg-slate-50">
                    <div className="font-medium">Mise à jour système</div>
                    <div className="text-xs text-muted-foreground mt-1">Il y a 2 heures</div>
                  </div>
                </div>
                <div className="p-2 border-t text-center">
                  <Button variant="ghost" className="w-full text-sm text-primary">
                    Voir toutes les notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 border border-slate-200">
                    <AvatarImage src="" alt={user?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm hidden md:inline-block">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center" onClick={goToProfile}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center" onClick={goToSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive flex items-center" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main 
          className={cn(
            "flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-200 bg-slate-50",
            sidebarCollapsed ? "md:ml-[70px]" : "md:ml-[240px]",
            "ml-0" // Default margin for mobile
          )}
        >
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
