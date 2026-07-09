# JobTracker

JobTracker est une application de suivi de candidatures composée de deux parties :

- `job-tracker-api` : API Express + Prisma pour gérer les candidatures
- `job-tracker-web` : frontend Next.js pour afficher et ajouter des candidatures

## Structure du projet

- `job-tracker-api/`
  - `package.json` : dépendances backend
  - `src/` : code source de l'API
  - `prisma/` : schéma Prisma et migrations

- `job-tracker-web/`
  - `package.json` : dépendances frontend
  - `src/` : application Next.js
  - `src/app/` : pages et composants
  - `src/lib/` : utilitaires et appels API

## Prérequis

- Node.js (version 18+ recommandée)
- npm
- Base de données PostgreSQL

## Installation

### 1. Backend

```bash
cd job-tracker-api
npm install
```

Configurer la base de données dans le fichier `.env` ou `DATABASE_URL` avant d'exécuter Prisma.

### 2. Frontend

```bash
cd job-tracker-web
npm install
```

## Lancement en développement

### Backend

```bash
cd job-tracker-api
npm run dev
```

L'API écoute normalement sur `http://localhost:5000`.

### Frontend

```bash
cd job-tracker-web
npm run dev
```

L'application Next.js écoute normalement sur `http://localhost:3000`.

## Endpoints principaux

- `GET /api/jobs` : récupérer la liste des candidatures
- `POST /api/jobs` : créer une candidature
- `GET /api/jobs/stats` : récupérer les statistiques de candidatures

## Notes importantes

- Le frontend utilise actuellement l'URL `http://localhost:5000/api/jobs` pour communiquer avec le backend.
- Le backend Prisma attend les champs `position`, `company`, `status`, `location`, `jobUrl`, `notes`.
- Le statut d'une candidature doit être l'une des valeurs : `applied`, `interview`, `offer`, `rejected`.

## Conseils

- Si l'application tourne sur un lecteur réseau, déplacez-la sur un dossier local pour de meilleures performances avec Next.js.
- Vérifiez que le backend et le frontend fonctionnent tous les deux avant de tester l'ajout de candidatures.
