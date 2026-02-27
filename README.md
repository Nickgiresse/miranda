This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Storage (PDFs des épreuves)

Les épreuves et corrigés sont stockés dans un bucket Supabase. **Créez le bucket une fois** dans le dashboard :

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard) → votre projet.
2. Menu **Storage** (à gauche).
3. Cliquez **New bucket**.
4. Nom du bucket : **`miranda-pdfs`** (exactement).
5. Cochez **Public bucket** pour que les liens « Voir / Télécharger / Corrigé » fonctionnent.
6. Validez avec **Create bucket**.

Sans ce bucket, les URLs des PDFs renverront « Bucket not found » (404).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Déploiement sur Vercel

### 1. Pousser le code sur GitHub

Si ce n’est pas déjà fait, créez un dépôt GitHub et poussez votre projet :

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USER/VOTRE_REPO.git
git push -u origin main
```

### 2. Créer le projet sur Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous (ou créez un compte).
2. Cliquez **Add New…** → **Project**.
3. Importez votre dépôt GitHub (autorisez Vercel si besoin).
4. Vercel détecte Next.js automatiquement. Ne changez pas **Build Command** (`next build`) ni **Output Directory**.
5. Avant de déployer, cliquez sur **Environment Variables** et ajoutez **toutes** les variables suivantes (comme dans `.env.local`, avec les vraies valeurs de production) :

| Variable | À renseigner |
|----------|----------------|
| `AUTH_SECRET` | Une chaîne aléatoire (ex. `openssl rand -base64 32`) |
| `DATABASE_URL` | URL Postgres **pooler** Supabase (avec le mot de passe de prod) |
| `DIRECT_URL` | URL Postgres **directe** Supabase (pour les migrations) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xvohxedgjcriqklzmqlt.supabase.co` (ou votre URL Supabase) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Clé **anon** / publishable Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé **service_role** Supabase (Dashboard → Settings → API) |

6. Définissez-les pour **Production**, **Preview** et **Development** si vous voulez les mêmes partout.
7. Cliquez **Deploy**.

### 3. Migrations Prisma (premier déploiement)

Les migrations ne s’exécutent pas automatiquement sur Vercel. **Une fois** après le premier déploiement (ou avant), appliquez-les sur la base de **production** :

```bash
# Avec les variables de prod dans .env (ou .env.production)
npx prisma migrate deploy
```

Ou depuis le dashboard Supabase : la base est déjà utilisée par l’app, assurez-vous que les tables existent (en ayant déjà fait `prisma migrate deploy` en local vers cette base, ou en exécutant les migrations avec `DATABASE_URL` / `DIRECT_URL` pointant vers Supabase prod).

### 4. Vérifications

- **Supabase Storage** : le bucket **`miranda-pdfs`** doit exister et être **public** (voir section « Supabase Storage » plus haut).
- **URLs** : après le déploiement, Vercel vous donne une URL du type `https://votre-app.vercel.app`. Les liens « Voir / Télécharger / Corrigé » des épreuves doivent utiliser cette origine pour les redirections.

Les déploiements suivants se feront à chaque `git push` sur la branche connectée (souvent `main`).
