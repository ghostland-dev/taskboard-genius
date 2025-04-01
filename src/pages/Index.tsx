
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Automatic redirection after a short delay
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/dashboard");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-primary">TaskBoard</span>
          </div>
          <div className="flex gap-4">
            {!isAuthenticated ? (
              <Button 
                onClick={() => navigate("/login")} 
                variant="default"
              >
                Connexion
              </Button>
            ) : (
              <Button 
                onClick={() => navigate("/dashboard")} 
                variant="default"
              >
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                Gérez vos tâches avec<br />
                <span className="text-primary">TaskBoard Genius</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-md">
                Une plateforme simple et efficace pour organiser votre travail, collaborer avec votre équipe et suivre votre progression.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Organisation simplifiée</h3>
                    <p className="text-slate-600">Créez, attribuez et organisez des tâches en quelques clics</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Collaboration en équipe</h3>
                    <p className="text-slate-600">Partagez des tâches et communiquez efficacement</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Suivi du temps</h3>
                    <p className="text-slate-600">Mesurez le temps passé sur chaque tâche</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleGetStarted} 
                size="lg" 
                className="gap-2"
              >
                Commencer maintenant
                <ArrowRight size={18} />
              </Button>
            </div>
            
            <div className="hidden md:block">
              <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200 transform rotate-1">
                <div className="space-y-4">
                  <div className="h-10 w-full bg-slate-100 rounded-md"></div>
                  <div className="flex gap-3">
                    <div className="h-20 w-1/3 bg-primary/10 rounded-md"></div>
                    <div className="h-20 w-1/3 bg-primary/20 rounded-md"></div>
                    <div className="h-20 w-1/3 bg-primary/30 rounded-md"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-slate-100 rounded-md"></div>
                  <div className="h-6 w-1/2 bg-slate-100 rounded-md"></div>
                  <div className="h-8 w-1/4 bg-primary/40 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <p>© {new Date().getFullYear()} TaskBoard Genius. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
