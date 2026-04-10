# TP REST API - NestJS

API REST réalisée avec NestJS, TypeORM et PostgreSQL (Neon).

## Technologies

- NestJS
- TypeORM
- PostgreSQL (Neon)
- Passport + JWT
- bcryptjs
- class-validator / class-transformer
- @ngneat/falso (seed)

## Variables d'environnement

Crée un fichier `.env` à la racine :

```env
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
JWT_SECRET=your_jwt_secret
```

## Installation

```bash
npm install
```

## Lancer le projet

```bash
npm run start:dev
```

## Seed

Génère des données fictives aléatoires avec `@ngneat/falso` :
- 10 skills aléatoires
- 5 users + 1 admin (mot de passe : `password123`)
- 1 CV par user avec 3 skills aléatoires

```bash
npm run seed
```

---

## Structure

```
src/
├── app.module.ts
├── main.ts
├── auth/          ← register, login, JWT, guards
├── cv/            ← CRUD CVs + middleware
├── user/          ← CRUD users
├── skill/         ← CRUD skills
└── common/
    └── middleware/
        └── auth.middleware.ts
```

---

## Entités et relations

```
User ──< Cv        OneToMany / ManyToOne
Cv  >──< Skill     ManyToMany (table intermediaire auto)
```

---

## Endpoints

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /auth/register | Inscription |
| POST | /auth/login | Connexion → retourne `access_token` |

### CV (JWT requis)
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /cv | Créer un CV (attaché au user connecté) |
| GET | /cv/all | Tous les CVs — admin uniquement (RolesGuard) |
| GET | /cv | Admin → tous les CVs / User → ses CVs |
| GET | /cv/:id | Voir un CV |
| PATCH | /cv/:id | Modifier un CV |
| DELETE | /cv/:id | Supprimer un CV |

### Skill
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /skill | Créer un skill |
| GET | /skill | Voir tous les skills |
| GET | /skill/:id | Voir un skill |
| PATCH | /skill/:id | Modifier un skill |
| DELETE | /skill/:id | Supprimer un skill |

### User
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /user | Créer un user |
| GET | /user | Voir tous les users |
| GET | /user/:id | Voir un user |
| PATCH | /user/:id | Modifier un user |
| DELETE | /user/:id | Supprimer un user |

---

## Authentification

### Register — POST /auth/register
```json
{ "username": "john", "email": "john@example.com", "password": "secret" }
```

### Login — POST /auth/login
```json
{ "email": "john@example.com", "password": "secret" }
```
Retourne :
```json
{ "access_token": "eyJhbGci..." }
```

Utiliser le token dans les requêtes suivantes :
```
Authorization: Bearer <access_token>
```

---

## Autorisation

### Rôles — enum `Role`

```ts
enum Role { User = 'user', Admin = 'admin' }
```

### User normal
- Voit et modifie uniquement ses propres CVs
- `403 Forbidden` s'il essaie d'accéder au CV d'un autre

### Admin
- Voit et modifie tous les CVs
- Accès exclusif à `GET /cv/all` via `RolesGuard`

### RolesGuard
Guard personnalisé qui lit le décorateur `@Roles(...)` pour autoriser ou bloquer.
Extensible : ajouter un nouveau rôle ne nécessite aucune modification du guard.

```ts
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('all')
findAllAdmin() { ... }
```

---

## Middleware

`AuthMiddleware` est appliqué sur `POST /cv`, `PATCH /cv/:id`, `DELETE /cv/:id`.

Il lit le header `auth-user`, décode le JWT et injecte `userId` dans la requête.
