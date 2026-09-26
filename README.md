# ioTactile Games

Plateforme de jeux navigateur solo et multijoueur, née pour prolonger l’esprit des sites Flash disparus — sandbox technique et catalogue de jeux soignés.

[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth%20%7C%20Functions-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white)](https://nodejs.org)

---

## Présentation

**ioTactile Games** est une application web de jeux en temps réel et en solo. Le projet sert à la fois de vitrine ludique et de terrain d’expérimentation autour de Nuxt, Firebase et d’une architecture domaine / infrastructure maintenable.

### Jeux disponibles

| Jeu | Mode | Description |
| --- | ---- | ----------- |
| **Dice** | Multijoueur (jusqu’à 4) | Partie de dés type Yahtzee, sessions Firestore, chat et classements |
| **Démineur** | Solo | Grille classique, difficultés prédéfinies ou custom, scoreboard |
| **Takuzu** | Solo | Puzzle binaire (Binairo), génération de grilles, timer et classement |
| **Life Game** | Solo | Automate cellulaire de Conway (expérimental) |

---

## Stack technique

| Couche | Technologies |
| ------ | ------------ |
| Frontend | [Nuxt 4](https://nuxt.com), Vue 3, TypeScript, Vuetify 4, Pinia, VueUse |
| Temps réel / auth | Firebase Auth, Firestore, App Check, VueFire |
| Audio | Howler (port audio découplé) |
| Backend | Cloud Functions (2nd gen), Firebase Admin |
| Qualité | ESLint, Prettier, Vitest |

---

## Architecture

Organisation orientée **domaine / ports / adapters** (hexagonal allégé), sans sur-ingénierie :

```
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

Principes retenus :

- Les **modèles domaine** exposent des `Date` ; Firebase `Timestamp` reste confiné aux converters.
- Les **règles métier** (sessions Dice, scoreboards, fin de partie) sont testables sans Firestore.
- Les **repositories** abstraient la persistance des classements (Minesweeper, Takuzu).
- Le module `shared/dice` est consommé par l’app et par `onDiceSessionEnd`.

---

## Prérequis

- **Node.js** 22 ou 24 (LTS récentes)
- **npm** 10+
- Compte Firebase (Auth, Firestore, Functions, App Check) pour le mode connecté
- Firebase CLI (optionnel, pour déployer les functions)

---

## Installation

```bash
git clone <url-du-depot>.git
cd iotactile-games
npm install
cd functions && npm install && cd ..
```

Lancer le serveur de développement :

```bash
npm run dev
```

L’application est disponible sur `http://localhost:3000` par défaut.

---

## Scripts

### Application (racine)

| Commande | Description |
| -------- | ----------- |
| `npm run dev` | Serveur de développement Nuxt |
| `npm run build` | Build production |
| `npm run preview` | Prévisualiser le build |
| `npm run generate` | Génération statique |
| `npm run test:unit` | Tests unitaires Vitest |
| `npm run lint` | ESLint + Prettier (contrôle) |
| `npm run lintfix` | Formatage + corrections ESLint |

### Cloud Functions (`functions/`)

| Commande | Description |
| -------- | ----------- |
| `npm run build` | Compilation TypeScript |
| `npm run lint` | ESLint |
| `npm run serve` | Émulateurs Firebase (functions) |
| `npm run deploy` | Déploiement des functions |

Runtime Functions : **Node.js 22** (`engines` dans `functions/package.json`).

---

## Tests

La suite Vitest couvre le domaine pur (règles Dice, scoreboards, générateur Takuzu, Life Game, agrégation fin de session, etc.) :

```bash
npm run test:unit -- --run
```

Les adapters Firebase / Howler sont isolés via ports et fakes ; les tests ne nécessitent pas d’émulateur.

---

## Firebase

| Service | Usage |
| ------- | ----- |
| **Authentication** | Comptes email / mot de passe, claims admin |
| **Firestore** | Sessions Dice, scores, classements |
| **App Check** | Protection des callables (reCAPTCHA v3) |
| **Cloud Functions** | Admin roles, fin de session Dice, purge des sessions expirées |

Configuration VueFire : `nuxt.config.ts`.  
Règles et indexes : `firestore.rules`, `firestore.indexes.json`.

Déploiement des functions :

```bash
cd functions
npm run deploy
```

> Le premier déploiement après migration vers les functions **2nd gen** peut nécessiter une vérification des permissions IAM / App Check.

---

## Structure utile

```
iotactile-games/
├── app.vue
├── nuxt.config.ts
├── vitest.config.mts
├── infrastructure/firestore/   # converters + repositories
├── shared/dice/                # logique partagée fin de session
├── utils/
│   ├── dice/                   # règles session, scoring
│   ├── minesweeper/
│   ├── takuzu/
│   ├── music/                  # port audio + services
│   └── lifegame/
└── functions/src/              # callables, triggers, scheduler
```

---

## Licence

Distribué sous licence [MIT](./LICENSE).

**Auteur :** Jordan Biesmans — [jbs.io@protonmail.com](mailto:jbs.io@protonmail.com)
