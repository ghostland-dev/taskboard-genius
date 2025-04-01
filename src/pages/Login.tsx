
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FirstLaunchInitializer from "@/components/FirstLaunchInitializer";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Skeleton } from "@/components/ui/skeleton";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSignupSuccess = () => {
    setActiveTab("login");
  };

  // If still loading, show a better loading indicator with skeletons
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
        <AuthHeader />
        
        <Card className="w-full max-w-md shadow-lg border-0">
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full mt-4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
        
        <p className="mt-4 text-sm text-muted-foreground">Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      {/* Initialize test users on first launch */}
      <FirstLaunchInitializer />
      
      <AuthHeader />
      
      <Card className="w-full max-w-md shadow-lg border-0 animate-fade-in">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>
                Entrez vos identifiants pour accéder à votre compte
              </CardDescription>
            </CardHeader>
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="signup">
            <CardHeader>
              <CardTitle>Inscription</CardTitle>
              <CardDescription>
                Créez un compte pour commencer à utiliser Task Manager
              </CardDescription>
            </CardHeader>
            <SignupForm onSuccess={handleSignupSuccess} />
          </TabsContent>
        </Tabs>
      </Card>
      
      <p className="mt-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Task Manager. Tous droits réservés.
      </p>
    </div>
  );
};

export default Login;
