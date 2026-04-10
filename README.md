# TP REST API - Auth, CV et Neon

Ce projet est une API NestJS réalisée pour le TP. Il met en place l’authentification, l’autorisation par rôle et la gestion des CV avec une base de données PostgreSQL hébergée sur Neon.

## Objectif du TP

Le but du projet est de couvrir les points suivants:

- inscription d’un utilisateur
- connexion avec génération d’un JWT
- protection des routes avec Passport + JWT
- association d’un CV à son propriétaire
- limitation des actions selon le rôle de l’utilisateur
- récupération de tous les CVs uniquement pour un admin
- récupération des CVs du user connecté uniquement pour un user normal
- stockage des données dans Neon PostgreSQL via TypeORM

## Technologies utilisées

- NestJS
- TypeORM
- PostgreSQL Neon
- Passport JWT
- bcryptjs
- class-validator / class-transformer

## Structure du projet

- `src/auth` : inscription, login, JWT, guards
- `src/user` : entité et service user
- `src/cv` : gestion des CVs
- `src/skill` : gestion des compétences liées aux CVs
- `src/commands/seed.ts` : insertion de données de test

## Fonctionnement de l’authentification

### 1. Inscription

L’utilisateur envoie:

- `username`
- `email`
- `password`

Le mot de passe est hashé avec `bcryptjs` avant d’être stocké.

### 2. Login

L’utilisateur se connecte avec son `email` et son `password`.

Si les identifiants sont corrects, l’API renvoie un JWT:

```json
{
  "access_token": "..."
}
```

Le token contient au minimum:

- `userId`
- `role`

## Fonctionnement des CVs

### Utilisateur normal

- il peut voir seulement ses CVs
- il peut modifier seulement ses CVs
- il peut supprimer seulement ses CVs
- il ne peut pas accéder aux CVs des autres utilisateurs

### Admin

- il peut voir tous les CVs
- il peut modifier ou supprimer tous les CVs
- il peut voir son propre CV comme les autres

## Intégration Neon

La base de données est connectée à Neon via TypeORM.

Dans [src/app.module.ts](src/app.module.ts), la connexion utilise:

- `DATABASE_URL`
- SSL activé
- `autoLoadEntities: true`
- `synchronize: true` pour le TP

### Variables d’environnement

Crée un fichier `.env` à la racine du projet avec au minimum:

```env
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
jwt_secret=your_jwt_secret
```

Tu peux aussi utiliser `JWT_SECRET` ou `SECRET_KEY` selon ton fichier `.env`, mais `jwt_secret` est bien supporté.

## Données de test

Le seed crée:

- 3 users
- 3 CVs
- plusieurs skills

Compte admin de test:

- email: `youssef.jaziri@gmail.com`
- password: `123456`

Comptes user de test:

- `amine.benali@gmail.com` / `123456`
- `sarra.trabelsi@gmail.com` / `123456`

## Installation

```bash
npm install
```

## Lancer le projet

```bash
npm run start
```

Mode développement:

```bash
npm run start:dev
```

## Build

```bash
npm run build
```

## Seed

```bash
npm run seed
```

## Tests

```bash
npm run test
npm run test:e2e
```

## Endpoints principaux

### Auth

- `POST /auth/register`
- `POST /auth/login`

### CV

- `POST /cv`
- `GET /cv`
- `GET /cv/:id`
- `PATCH /cv/:id`
- `DELETE /cv/:id`
