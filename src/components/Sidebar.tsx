
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  Settings,
  Users,
  LogOut,
  BarChart3,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isSuperAdmin = user?.role === "superadmin";
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const navItems = [
    { name: "Tableau de bord", path: "/dashboard", icon: <LayoutGrid size={20} /> },
    { name: "Tâches", path: "/tasks", icon: <CheckSquare size={20} /> },
    { name: "Calendrier", path: "/calendar", icon: <Calendar size={20} /> },
  ];

  const adminNavItems = [
    { name: "Utilisateurs", path: "/users", icon: <Users size={20} /> },
    { name: "Statistiques", path: "/analytics", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col fixed left-0 z-30",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-xl font-bold text-primary">
            TaskBoard
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "transition-transform", 
            collapsed ? "ml-auto rotate-180" : "ml-auto"
          )}
        >
          <ChevronLeft size={20} />
        </Button>
      </div>

      <div className="flex flex-col flex-grow p-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
              location.pathname === item.path &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <span className="mr-2">{item.icon}</span>
            {!collapsed && <span className="transition-opacity duration-200">{item.name}</span>}
          </Link>
        ))}

        {/* Divider before admin items */}
        {isAdmin && <div className="h-px bg-sidebar-border my-2" />}

        {/* Admin navigation items */}
        {isAdmin &&
          adminNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                location.pathname === item.path &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <span className="mr-2">{item.icon}</span>
              {!collapsed && <span className="transition-opacity duration-200">{item.name}</span>}
            </Link>
          ))}
      </div>

      {/* User section at bottom */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/settings"
          className={cn(
            "flex items-center px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
            location.pathname === "/settings" &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <span className="mr-2">
            <Settings size={20} />
          </span>
          {!collapsed && <span className="transition-opacity duration-200">Paramètres</span>}
        </Link>
        <Button
          variant="ghost"
          className="flex items-center justify-start w-full px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          onClick={logout}
        >
          <span className="mr-2">
            <LogOut size={20} />
          </span>
          {!collapsed && <span className="transition-opacity duration-200">Déconnexion</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
