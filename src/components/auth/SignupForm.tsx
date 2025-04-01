
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, UserPlus, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");
  const [signupName, setSignupName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Tentative d'inscription avec:", { email: signupEmail, name: signupName });
      const success = await signup(signupEmail, signupPassword, signupName);
      
      if (success) {
        toast.success("Inscription réussie! Vérifiez votre email pour confirmer votre compte.");
        onSuccess();
      } else {
        setError("L'inscription a échoué. Veuillez vérifier vos informations et réessayer.");
      }
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="name"
              type="text"
              placeholder="Votre nom"
              className="pl-10"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="signup-email"
              type="email"
              placeholder="votre@email.com"
              className="pl-10"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-password">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="signup-password"
              type="password"
              placeholder="Minimum 8 caractères"
              className="pl-10"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Le mot de passe doit contenir au moins 8 caractères
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Créer un compte
            </>
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
