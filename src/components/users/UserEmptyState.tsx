
import React from "react";
import { AlertTriangle } from "lucide-react";

const UserEmptyState: React.FC = () => {
  return (
    <div className="bg-slate-50 p-6 rounded-lg flex flex-col items-center justify-center h-64">
      <AlertTriangle className="h-12 w-12 text-slate-400 mb-4" />
      <p className="text-center text-slate-600">
        Aucun utilisateur trouvé. Les utilisateurs apparaîtront ici une fois qu'ils auront créé un compte.
      </p>
    </div>
  );
};

export default UserEmptyState;
