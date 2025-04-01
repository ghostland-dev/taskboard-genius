
# Task Manager Application

Une application de gestion de tâches avec authentification et abonnements.

## Fonctionnalités

- Authentification des utilisateurs (inscription, connexion, déconnexion)
- Gestion des tâches (création, modification, suppression)
- Tableau de bord avec statistiques
- Calendrier des tâches
- Gestion des utilisateurs (pour administrateurs)
- Abonnements premium via Stripe

## Prérequis

- Node.js 18+ 
- pnpm ou npm 
- Compte Supabase (pour le backend)
- Compte Stripe (pour les paiements)

## Installation

1. Cloner le dépôt
```bash
git clone https://github.com/votre-nom/task-manager.git
cd task-manager
```

2. Installer les dépendances
```bash
pnpm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Puis modifiez le fichier `.env` avec vos propres clés.

4. Lancer l'application en développement
```bash
pnpm run dev
```

## Déploiement avec Docker

1. Construire l'image Docker
```bash
docker build -t task-manager .
```

2. Exécuter l'application avec Docker Compose
```bash
docker-compose up -d
```

## Accès à l'application

- URL de développement: http://localhost:5173
- URL de production: https://votre-domaine.com

## Technologies utilisées

- React
- TypeScript
- TailwindCSS
- Vite
- Supabase
- Stripe
