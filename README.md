# ioTactile Games

Plateforme de jeux navigateur solo et multijoueur, née pour prolonger l’esprit des sites Flash disparus — sandbox technique et catalogue de jeux soignés.

## Features

| Jeu           | Mode                    | Description                                                          |
| ------------- | ----------------------- | -------------------------------------------------------------------- |
| **Dice**      | Multijoueur (jusqu’à 4) | Partie de dés type Yahtzee, sessions Firestore, chat et classements  |
| **Démineur**  | Solo                    | Grille classique, difficultés prédéfinies ou custom, scoreboard      |
| **Takuzu**    | Solo                    | Puzzle binaire (Binairo), génération de grilles, timer et classement |
| **Life Game** | Solo                    | Automate cellulaire de Conway (expérimental)                         |

## Stack

| Couche            | Technologies                                                            |
| ----------------- | ----------------------------------------------------------------------- |
| Frontend          | [Nuxt 4](https://nuxt.com), Vue 3, TypeScript, Vuetify 4, Pinia, VueUse |
| Temps réel / auth | Firebase Auth, Firestore, App Check, VueFire                            |
| Audio             | Howler (port audio découplé)                                            |
| Backend           | Cloud Functions (2nd gen), Firebase Admin                               |
| Qualité           | ESLint, Prettier, Vitest                                                |

## Structure

```
iotactile-games/
├── app.vue
├── nuxt.config.ts
├── vitest.config.mts
├── components/          # UI Vue (présentation)
├── pages/               # Routes Nuxt
├── composables/         # Composition roots (ex. useDiceSession)
├── utils/               # Domaine pur + use-cases (jeux, règles, scoreboards)
├── shared/              # Logique partagée app ↔ Cloud Functions
├── infrastructure/      # Adapters Firestore, converters Timestamp ↔ Date
├── types/               # Modèles domaine (dates en Date)
├── stores/              # État UI Pinia
└── functions/           # Cloud Functions (Node 22)
```

## Prérequis

- **Node.js** 22 ou 24 (LTS récentes)
- **npm** 10+
- Compte Firebase (Auth, Firestore, Functions, App Check) pour le mode connecté
- Firebase CLI (optionnel, pour déployer les functions)

## Démarrage

```bash
git clone <url-du-depot>.git
cd iotactile-games
npm install
cd functions && npm install && cd ..
npm run dev
```

L’application est disponible sur `http://localhost:3000` par défaut.

Configuration VueFire : `nuxt.config.ts`. Règles et indexes : `firestore.rules`, `firestore.indexes.json`.

Déploiement des functions :

```bash
cd functions
npm run deploy
```

> Le premier déploiement après migration vers les functions **2nd gen** peut nécessiter une vérification des permissions IAM / App Check.

## Scripts

### Application (racine)

| Commande            | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Serveur de développement Nuxt  |
| `npm run build`     | Build production               |
| `npm run preview`   | Prévisualiser le build         |
| `npm run generate`  | Génération statique            |
| `npm run test:unit` | Tests unitaires Vitest         |
| `npm run lint`      | ESLint + Prettier (contrôle)   |
| `npm run lintfix`   | Formatage + corrections ESLint |

### Cloud Functions (`functions/`)

| Commande         | Description                     |
| ---------------- | ------------------------------- |
| `npm run build`  | Compilation TypeScript          |
| `npm run lint`   | ESLint                          |
| `npm run serve`  | Émulateurs Firebase (functions) |
| `npm run deploy` | Déploiement des functions       |

Runtime Functions : **Node.js 22** (`engines` dans `functions/package.json`).

## Architecture

Organisation orientée **domaine / ports / adapters** (hexagonal allégé) :

- Les **modèles domaine** exposent des `Date` ; Firebase `Timestamp` reste confiné aux converters.
- Les **règles métier** (sessions Dice, scoreboards, fin de partie) sont testables sans Firestore.
- Les **repositories** abstraient la persistance des classements (Minesweeper, Takuzu).
- Le module `shared/dice` est consommé par l’app et par `onDiceSessionEnd`.

Firebase :

| Service             | Usage                                                         |
| ------------------- | ------------------------------------------------------------- |
| **Authentication**  | Comptes email / mot de passe, claims admin                    |
| **Firestore**       | Sessions Dice, scores, classements                            |
| **App Check**       | Protection des callables (reCAPTCHA v3)                       |
| **Cloud Functions** | Admin roles, fin de session Dice, purge des sessions expirées |

## Licence

Propriétaire — tous droits réservés. Voir [LICENSE](./LICENSE).
