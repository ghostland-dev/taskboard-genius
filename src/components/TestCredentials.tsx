
import React from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface TestUser {
  email: string;
  password: string;
  role: string;
}

const TestCredentials: React.FC = () => {
  const testUsers: TestUser[] = [
    {
      email: "user@example.com",
      password: "password123",
      role: "user"
    },
    {
      email: "admin@example.com",
      password: "password123",
      role: "admin"
    },
    {
      email: "superadmin@example.com",
      password: "password123",
      role: "superadmin"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copié dans le presse-papier");
      },
      () => {
        toast.error("Échec de la copie");
      }
    );
  };

  const getBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-500 hover:bg-purple-600";
      case "admin":
        return "bg-blue-500 hover:bg-blue-600";
      case "user":
      default:
        return "bg-green-500 hover:bg-green-600";
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Identifiants de test</CardTitle>
        <CardDescription>
          Utilisez ces identifiants pour tester les différents rôles d'utilisateurs dans l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rôle</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mot de passe</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testUsers.map((user) => (
              <TableRow key={user.email}>
                <TableCell>
                  <Badge className={getBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(user.email)}
                    className="mr-2"
                  >
                    <Copy className="h-3 w-3 mr-1" /> Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(user.password)}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Mot de passe
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TestCredentials;
