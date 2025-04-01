
import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
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
import { Eye, EyeOff, Lock, Mail, User, Shield, AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schéma de validation pour le formulaire de connexion
const loginSchema = z.object({
  email: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

// Schéma de validation pour le formulaire d'inscription
const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom est trop long"),
  email: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  isSuperAdmin: z.boolean().default(false),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions d'utilisation",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [attemptCount, setAttemptCount] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);
  
  const { login, signup, isAuthenticated, loading } = useAuth();

  // Formulaire de connexion
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Formulaire d'inscription
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isSuperAdmin: false,
      termsAccepted: false,
    },
  });

  // Vérifier si l'utilisateur est bloqué
  useEffect(() => {
    const storedLockout = localStorage.getItem('lockoutUntil');
    if (storedLockout) {
      const lockoutTime = new Date(storedLockout);
      if (lockoutTime > new Date()) {
        setLockoutUntil(lockoutTime);
      } else {
        localStorage.removeItem('lockoutUntil');
        setLockoutUntil(null);
      }
    }
    
    const storedAttempts = localStorage.getItem('loginAttempts');
    if (storedAttempts) {
      setAttemptCount(parseInt(storedAttempts, 10));
    }
  }, []);

  // Vérification du verrouillage
  const checkLockout = () => {
    if (lockoutUntil && lockoutUntil > new Date()) {
      const remainingTime = Math.ceil((lockoutUntil.getTime() - new Date().getTime()) / 60000);
      toast.error(`Compte temporairement bloqué. Réessayez dans ${remainingTime} minute(s).`);
      return true;
    }
    return false;
  };

  // Gestion des tentatives échouées
  const handleFailedAttempt = () => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    localStorage.setItem('loginAttempts', newAttemptCount.toString());
    
    // Après 5 tentatives, verrouiller pendant 15 minutes
    if (newAttemptCount >= 5) {
      const lockoutTime = new Date(new Date().getTime() + 15 * 60000);
      setLockoutUntil(lockoutTime);
      localStorage.setItem('lockoutUntil', lockoutTime.toString());
      toast.error("Trop de tentatives échouées. Compte bloqué pendant 15 minutes.");
    }
  };

  // Gestion de la connexion
  const handleLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (checkLockout()) return;
    
    try {
      const result = await login(values.email, values.password);
      if (!result.success) {
        handleFailedAttempt();
      } else {
        // Réinitialiser le compteur en cas de succès
        setAttemptCount(0);
        localStorage.removeItem('loginAttempts');
      }
    } catch (error) {
      handleFailedAttempt();
    }
  };

  // Gestion de l'inscription
  const handleRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {    
    await signup(values.email, values.password, values.name, values.isSuperAdmin);
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
      
      {/* Right side - Login/Register form */}
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
              <CardTitle className="text-2xl font-bold">Accès</CardTitle>
              <CardDescription>
                Connectez-vous ou créez un compte pour commencer
              </CardDescription>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mx-6">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
                    <CardContent className="space-y-4">
                      {lockoutUntil && lockoutUntil > new Date() && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
                          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Compte temporairement bloqué</p>
                            <p className="text-sm">
                              Trop de tentatives échouées. Réessayez dans {Math.ceil((lockoutUntil.getTime() - new Date().getTime()) / 60000)} minute(s).
                            </p>
                          </div>
                        </div>
                      )}

                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                              <FormControl>
                                <Input
                                  type="email" 
                                  placeholder="votre@email.com"
                                  className="pl-10"
                                  autoComplete="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Mot de passe</FormLabel>
                              <Link to="/forgot-password" className="text-primary hover:underline text-xs">
                                Mot de passe oublié?
                              </Link>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                              <FormControl>
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  className="pl-10"
                                  autoComplete="current-password"
                                  {...field}
                                />
                              </FormControl>
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={loading || (lockoutUntil !== null && lockoutUntil > new Date())}
                      >
                        {loading ? "Connexion..." : "Se connecter"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Votre nom"
                                  className="pl-10"
                                  autoComplete="name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="votre@email.com"
                                  className="pl-10"
                                  autoComplete="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                              <FormControl>
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  className="pl-10"
                                  {...field}
                                />
                              </FormControl>
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                              <FormControl>
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  className="pl-10"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 my-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">
                                J'accepte les <Link to="/terms" className="text-primary hover:underline">conditions d'utilisation</Link> et la <Link to="/privacy" className="text-primary hover:underline">politique de confidentialité</Link>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="isSuperAdmin"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="super-admin" 
                              />
                            </FormControl>
                            <div className="grid gap-1.5 leading-none">
                              <FormLabel
                                htmlFor="super-admin"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-1"
                              >
                                <Shield className="h-4 w-4 text-primary" />
                                <span>Créer un compte Super Admin</span>
                              </FormLabel>
                              <p className="text-xs text-muted-foreground">
                                Les Super Admins sont créés sans vérification d'email requise
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={loading}
                      >
                        {loading ? "Création..." : "Créer un compte"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
