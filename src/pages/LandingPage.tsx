
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Calendar, 
  Bell, 
  BarChart3, 
  Users, 
  ShieldCheck,
  Repeat,
  ArrowRight
} from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="w-full py-4 px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold">TaskBoard Genius</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-slate-600 hover:text-primary transition-colors">Fonctionnalités</a>
            <a href="#testimonials" className="text-slate-600 hover:text-primary transition-colors">Témoignages</a>
            <a href="#pricing" className="text-slate-600 hover:text-primary transition-colors">Tarifs</a>
          </div>
          <div>
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => navigate('/login')}
            >
              Connexion
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/login')}
            >
              Essai gratuit
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Gérez vos tâches avec intelligence
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                TaskBoard Genius simplifie la gestion de vos tâches quotidiennes et vous aide à atteindre une productivité optimale.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
                  onClick={() => navigate('/login')}
                >
                  Commencer gratuitement
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                >
                  Voir la démo
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="glass-card p-6 animate-slide-up">
                <img 
                  src="https://cdn.pixabay.com/photo/2020/04/08/16/32/calendar-5017766_1280.jpg" 
                  alt="TaskBoard Dashboard Preview" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-heading">Fonctionnalités principales</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Découvrez comment TaskBoard Genius peut transformer votre manière de gérer vos tâches et booster votre productivité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle size={24} />,
                title: "Suivi de tâches intelligent",
                description: "Créez, organisez et suivez vos tâches avec une interface intuitive et puissante."
              },
              {
                icon: <Calendar size={24} />,
                title: "Calendrier intégré",
                description: "Visualisez toutes vos tâches dans un calendrier interactif pour une meilleure planification."
              },
              {
                icon: <Bell size={24} />,
                title: "Rappels personnalisés",
                description: "Recevez des notifications par email, SMS ou dans l'application pour ne jamais manquer une échéance."
              },
              {
                icon: <Repeat size={24} />,
                title: "Tâches récurrentes",
                description: "Automatisez vos tâches répétitives quotidiennes, hebdomadaires, mensuelles ou annuelles."
              },
              {
                icon: <BarChart3 size={24} />,
                title: "Analyses détaillées",
                description: "Obtenez des insights sur votre productivité avec des graphiques et statistiques avancés."
              },
              {
                icon: <Users size={24} />,
                title: "Collaboration d'équipe",
                description: "Partagez et assignez des tâches à votre équipe pour une meilleure coordination."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 card-hover">
                <div className="feature-icon mb-4 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-heading">Ce que disent nos utilisateurs</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Des milliers d'utilisateurs font confiance à TaskBoard Genius pour gérer leurs tâches quotidiennes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "TaskBoard Genius a complètement transformé ma façon de gérer mes tâches. Je n'ai jamais été aussi productif!",
                author: "Marie Dupont",
                role: "Directrice Marketing"
              },
              {
                quote: "La meilleure solution que j'ai trouvée pour organiser mon travail et mes projets personnels. Simple et puissant.",
                author: "Thomas Bernard",
                role: "Développeur Web"
              },
              {
                quote: "Notre équipe utilise TaskBoard Genius quotidiennement, et notre efficacité a augmenté de manière significative.",
                author: "Sophie Martin",
                role: "Chef de Projet"
              }
            ].map((testimonial, index) => (
              <div key={index} className="glass-card p-8 card-hover">
                <div className="flex flex-col h-full">
                  <div className="mb-6 text-xl italic text-slate-700">"{testimonial.quote}"</div>
                  <div className="mt-auto">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-slate-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-heading">Plans tarifaires simples</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Choisissez le plan qui correspond à vos besoins, sans frais cachés.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Gratuit",
                price: "0€",
                period: "pour toujours",
                description: "Pour les besoins personnels basiques",
                features: [
                  "Jusqu'à 20 tâches",
                  "Calendrier basique",
                  "Rappels par email",
                  "1 utilisateur"
                ]
              },
              {
                name: "Standard",
                price: "9,99€",
                period: "par mois",
                description: "Pour les professionnels et petites équipes",
                features: [
                  "Jusqu'à 500 tâches",
                  "Calendrier avancé",
                  "Rappels par email et SMS",
                  "Jusqu'à 5 utilisateurs",
                  "Analyses basiques",
                  "Support prioritaire"
                ],
                popular: true
              },
              {
                name: "Premium",
                price: "19,99€",
                period: "par mois",
                description: "Pour les entreprises et grandes équipes",
                features: [
                  "Tâches illimitées",
                  "Toutes les fonctionnalités",
                  "Tous types de rappels",
                  "Utilisateurs illimités",
                  "Analyses avancées",
                  "Support premium 24/7",
                  "API access"
                ]
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-sm border overflow-hidden card-hover ${
                  plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : 'border-slate-100'
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary text-white text-center py-1 text-sm font-medium">
                    Le plus populaire
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-slate-500">/{plan.period}</span>
                  </div>
                  <p className="text-slate-600 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={
                      plan.popular 
                        ? "w-full bg-primary hover:bg-primary/90" 
                        : "w-full bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }
                    onClick={() => navigate('/login')}
                  >
                    {plan.popular ? "Commencer maintenant" : "S'inscrire"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à révolutionner votre gestion de tâches?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont transformé leur productivité grâce à TaskBoard Genius.
          </p>
          <Button 
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            onClick={() => navigate('/login')}
          >
            <span>Commencer gratuitement</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <h3 className="text-xl font-bold">TaskBoard Genius</h3>
              </div>
              <p className="text-slate-400">
                La solution intelligente pour la gestion de vos tâches personnelles et professionnelles.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">À propos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Notre histoire</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Équipe</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Tutoriels</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
            <p>© {new Date().getFullYear()} TaskBoard Genius. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
