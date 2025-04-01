
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { formatDate } from "@/lib/utils-date";

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEditUser }) => {
  const getSubscriptionBadgeStyle = (subscription?: string) => {
    switch (subscription) {
      case "premium":
        return "border-yellow-300 text-yellow-700 bg-yellow-50";
      case "standard":
        return "border-blue-300 text-blue-700 bg-blue-50";
      case "expired":
        return "border-red-300 text-red-700 bg-red-50";
      default:
        return "border-gray-300 text-gray-700 bg-gray-50";
    }
  };

  const getSubscriptionLabel = (subscription?: string) => {
    switch (subscription) {
      case "premium":
        return "Premium";
      case "standard":
        return "Standard";
      case "expired":
        return "Expiré";
      default:
        return "Essai";
    }
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="px-6 py-3 text-left font-medium text-slate-700">Nom</th>
          <th className="px-6 py-3 text-left font-medium text-slate-700">Email</th>
          <th className="px-6 py-3 text-left font-medium text-slate-700">Rôle</th>
          <th className="px-6 py-3 text-left font-medium text-slate-700">Abonnement</th>
          <th className="px-6 py-3 text-left font-medium text-slate-700">Inscription</th>
          <th className="px-6 py-3 text-left font-medium text-slate-700">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b hover:bg-slate-50">
            <td className="px-6 py-4">{user.name || "N/A"}</td>
            <td className="px-6 py-4">{user.email || "N/A"}</td>
            <td className="px-6 py-4">
              <Badge variant={user.role === "superadmin" ? "default" : "outline"}>
                {user.role === "superadmin" ? "Super Admin" : "Utilisateur"}
              </Badge>
            </td>
            <td className="px-6 py-4">
              <Badge 
                variant="outline" 
                className={getSubscriptionBadgeStyle(user.subscription)}
              >
                {getSubscriptionLabel(user.subscription)}
              </Badge>
            </td>
            <td className="px-6 py-4">{formatDate(user.created_at)}</td>
            <td className="px-6 py-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEditUser(user)}
              >
                Modifier
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
