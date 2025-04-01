
import React from "react";
import { Loader2 } from "lucide-react";

const UserLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      <p className="ml-2">Chargement des utilisateurs...</p>
    </div>
  );
};

export default UserLoading;
