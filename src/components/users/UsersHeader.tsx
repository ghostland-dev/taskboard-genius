
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UsersHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold gradient-heading">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground mt-1">
          Administrez les comptes utilisateurs de votre application
        </p>
      </div>
      <Button 
        className="bg-brand-500 hover:bg-brand-600"
        onClick={() => navigate("/settings?tab=subscription")}
      >
        <UserPlus size={16} className="mr-2" />
        Gérer les abonnements
      </Button>
    </div>
  );
};

export default UsersHeader;
