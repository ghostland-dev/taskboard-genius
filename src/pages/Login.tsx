
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestCredentials from "@/components/TestCredentials";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import FirstLaunchInitializer from "@/components/FirstLaunchInitializer";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSignupSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      {/* Initialize test users on first launch */}
      <FirstLaunchInitializer />
      
      <AuthHeader />
      
      <TestCredentials />
      
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
