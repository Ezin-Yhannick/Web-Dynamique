# DMP : environnement Docker

Prototype de **Dossier Médical Partagé** sécurisé par la blockchain (AAW2304, Master 2).
Ce dépôt démarre **tous les services avec une seule commande** (exigence ENF-16).

## Services

| Service | Rôle | Port hôte |
|---|---|---|
| `front-react` | Interface React (nginx) | **8080** |
| `api-dmp` | API Laravel | **8000** |
| `db` | MySQL 8 | non publié |
| `anip`, `centres`, `pharmacies`, `medecins` | Services de référence simulés | non publiés |
| `hardhat` | Réseau Ethereum local | non publié |
| `blockchain` | Service Node.js d'ancrage | non publié |

Les services se joignent par leur nom (`db`, `anip`, `blockchain`...) sur le réseau `dmp-net`.

## Prérequis

- Docker Desktop (Windows/macOS) ou Docker Engine + plugin Compose (Linux)
- Git, ports **8000** et **8080** libres

## Installation

1. Cloner le dépôt puis `cd dmp`.
2. Mettre en place l'API Laravel si ce n'est pas déjà fait : voir `api-dmp/LISEZMOI-API.md`.
3. Créer le fichier d'environnement : `cp .env.example .env`, puis renseigner `APP_KEY`
   et changer les mots de passe.
4. Vérifier : `docker compose config`
5. Démarrer : `docker compose up -d --build`
6. Contrôler : `docker compose ps` (`db`, `hardhat`, `blockchain` doivent être `healthy`)

## Accès

- Application : http://localhost:8080
- API : http://localhost:8000/api/health (réponse attendue : `{"db":"ok","anip":200}`)

## Commandes utiles

    docker compose logs -f api-dmp     # journaux d'un service
    docker compose up -d --build       # après modification du code
    docker compose down                # arrêt (les données MySQL sont conservées)
    docker compose down -v             # arrêt ET suppression des données

## Remarques

- `.env` n'est **jamais** versionné ; `.env.example` sert de modèle.
- `VITE_API_URL` est lue **à la construction** du front : après l'avoir changée, relancer `up -d --build`.
- Les contrats Solidity (`RegistreDMP`) se placent dans `blockchain/contracts/` (groupe 4).
