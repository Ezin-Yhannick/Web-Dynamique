# DMP – Environnement Docker

Prototype de Dossier Médical Partagé (AAW2304). Un seul fichier compose décrit tous les services (cahier des charges §8.1, ENF-16).

## Démarrage

```bash
git clone <dépôt> && cd <dépôt>
docker compose up -d          # aucun .env requis ; premier build : plusieurs minutes
docker compose ps             # tout doit être « healthy »
```

Prérequis : Docker Desktop (Windows/macOS) ou Docker Engine + plugin Compose v2 (Linux).

## Services et ports

| Service | Rôle | Port hôte | Adresse interne (réseau Docker) |
|---|---|---|---|
| front-react | React/Vite servi par Nginx | 5173 | – |
| api-dmp | API Laravel | 8000 | `http://api-dmp:8000` |
| api-queue / api-scheduler | Tâches différées et planifiées (même image que api-dmp) | – | – |
| mysql | MySQL 8 | 3307 | `mysql:3306` |
| anip | Service ANIP simulé | 8001 | `http://anip:8000` |
| centres | Référentiel des centres | 8002 | `http://centres:8000` |
| pharmacies | Référentiel des pharmacies | 8003 | `http://pharmacies:8000` |
| medecins | Référentiel des médecins | 8004 | `http://medecins:8000` |
| blockchain | Service Node.js / ethers.js | 3000 | `http://blockchain:3000` |
| hardhat | Réseau Ethereum local | 8545 | `http://hardhat:8545` |
| hardhat-deploy | Job : déploie `RegistreDMP` puis s'arrête | – | – |
| mailpit | Boîte de capture des courriels (EF-06) | 8025 | `mailpit:1025` |

Ordre de démarrage : mysql et hardhat → hardhat-deploy → blockchain ; les 4 référentiels → api-dmp → api-queue, api-scheduler.

## Arborescence attendue

```
docker-compose.yml  docker-compose.dev.yml  .env.example
docker/laravel/       Dockerfile, entrypoint.sh, php.ini (partagés)   [groupe 4]
api-dmp/              projet Laravel                                  [groupe 1]
front-react/          projet Vite (+ Dockerfile, nginx.conf fournis)  [groupe 2]
service-anip/  service-centres-sante/  service-pharmacies/  service-medecins/   [groupe 3]
blockchain/           projet Hardhat (+ Dockerfile fourni)            [groupe 4]
service-blockchain/   service Node.js (+ Dockerfile fourni)           [groupe 4]
```

Les Dockerfiles fournis sont à la racine de chaque dossier ; les groupes y déposent leur code à côté.

## Contrat à respecter par chaque composant

**Laravel (api-dmp et 4 référentiels)**, Laravel 11+ :
- `composer.json` à la racine du projet ; l'application écoute sur le port 8000 (déjà géré).
- Les secrets viennent de l'environnement du conteneur, jamais d'un `.env` commité.
- Les seeders s'exécutent **une seule fois** au premier démarrage ; `docker compose down -v` pour recharger.
- api-dmp : variables fournies : `DB_*`, `APP_KEY`, `PSEUDONYM_SECRET`, `CORS_ALLOWED_ORIGINS`, `ANIP_URL`, `CENTRES_URL`, `PHARMACIES_URL`, `MEDECINS_URL`, `BLOCKCHAIN_URL`, `MAIL_*`. Le groupe 1 les relie à `config/cors.php` et `config/services.php`.
- Files d'attente : `QUEUE_CONNECTION=database` ; penser à `php artisan queue:table` (migration `jobs`).
- Planification : déclarer l'expiration des consentements et des ordonnances dans `routes/console.php`.
- Référentiels : SQLite, recréé avec le conteneur (pas de MySQL dédié). Un groupe peut remplacer ce Dockerfile par le sien s'il choisit une autre techno, à condition de garder le port 8000 et le nom de service.

**blockchain/** : `hardhat.config.js` déclare un réseau `docker` (`url: process.env.HARDHAT_RPC_URL`) ; `scripts/deploy.js` écrit `{ address, abi }` dans `process.env.DEPLOY_OUTPUT`.

**service-blockchain/** : `package.json` avec un script `start`, écoute sur `PORT` (3000) ; lit `RPC_URL`, `PRIVATE_KEY` et le fichier `CONTRACT_FILE`.

**front-react/** : `npm run build` produit `dist/`. L'URL de l'API se lit avec `import.meta.env.VITE_API_URL`.

## Développement

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Le code est monté dans les conteneurs ; le front tourne sous Vite avec rechargement à chaud. Après un changement de dépendances Laravel : `docker compose exec api-dmp composer install`. Si un build change `composer.json` et que `vendor` semble périmé : `docker compose down` puis `docker compose -f ... up -d --build -V`.

## Commandes utiles

```bash
docker compose logs -f api-dmp                 # journaux d'un service
docker compose up -d --build api-dmp           # reconstruire un seul service
docker compose exec api-dmp php artisan test   # tests (ENF-19)
docker compose exec api-dmp php artisan tinker
docker compose down                            # arrêt, données conservées
docker compose down -v                         # arrêt + remise à zéro complète
```

## Points d'attention

- **La chaîne Hardhat est en mémoire.** Si le conteneur `hardhat` redémarre, les ancrages et le journal des accès disparaissent alors que MySQL les référence encore. Pour un état cohérent : `docker compose down -v` puis `up -d`. À prévoir côté groupes 1 et 4 : re-ancrage des documents au redémarrage.
- **APP_KEY** chiffre les données au repos (ENF-06) : la changer rend les données existantes illisibles. Les valeurs par défaut du compose sont des clés de prototype (données fictives uniquement).
- **Windows** : `.gitattributes` force les fins de ligne LF sur les scripts `.sh` ; sans cela le conteneur échoue avec « exec format error ».
- **Test sur smartphone** (interface patient) : mettre dans `.env` l'IP du PC pour `VITE_API_URL`, et l'ajouter aux origines CORS de l'API.
- **Ports déjà pris** : les modifier dans `.env`.
- Les conteneurs Laravel tournent en root avec le serveur intégré de PHP : choix de prototype, pas de production.

## Recette

| Test | Commande |
|---|---|
| ENF-16 / O7 : démarrage en une commande | `git clone … && docker compose up -d` |
| ENF-17 : ANIP indisponible → 503 | `docker compose stop anip`, puis inscription patient |
| ENF-17 : blockchain indisponible | `docker compose stop blockchain`, puis dépôt d'un document (état « ancrage en attente ») |
