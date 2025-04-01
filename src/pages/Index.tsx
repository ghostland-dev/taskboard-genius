
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-200 to-brand-400">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">TaskBoard Genius</h1>
        <p className="text-xl text-white/80">Chargement de l'application...</p>
      </div>
    </div>
  );
};

export default Index;
