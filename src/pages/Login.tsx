
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login(email, password);
    setIsLoading(false);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Hero image and text (on medium+ screens) */}
      <div className="hidden md:flex md:w-1/2 hero-gradient items-center justify-center p-8">
        <div className="max-w-md text-white space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white h-10 w-10 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">T</span>
            </div>
            <h1 className="text-2xl font-bold">TaskBoard Genius</h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold">Bienvenue sur la plateforme de gestion de tâches intelligente</h2>
          
          <p className="text-white/80 text-lg">
            Organisez, planifiez et suivez toutes vos tâches en un seul endroit pour booster votre productivité.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">+10K</div>
              <div className="text-white/70">Utilisateurs actifs</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">4.9/5</div>
              <div className="text-white/70">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="flex flex-col items-center justify-center p-6 md:p-8 flex-1 md:w-1/2 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-primary h-10 w-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h1 className="text-2xl font-bold">TaskBoard Genius</h1>
            </div>
            <p className="text-slate-600">
              La solution intelligente pour la gestion de tâches
            </p>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription>
                Entrez vos identifiants pour accéder à votre espace
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                    <a href="#" className="text-primary hover:underline text-xs">
                      Mot de passe oublié?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
                <div className="mt-4 text-center text-sm">
                  <p>
                    Pas encore de compte?{" "}
                    <a href="#" className="text-primary hover:underline">
                      Créer un compte
                    </a>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-6 text-center text-slate-500 text-sm">
            <p>
              Pour une démo: <span className="font-medium">superadmin@nomdomain.fr / HolySsit++ @!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
