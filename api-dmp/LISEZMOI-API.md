# api-dmp : mettre en place l'API Laravel

Ce dossier contient déjà le `Dockerfile` et le `.dockerignore`. Il manque le projet Laravel
lui-même (groupe 1). **Si le groupe 1 a déjà son projet, copiez simplement le Dockerfile
et le .dockerignore dedans** et passez à l'étape 3.

## 1. Créer un projet Laravel (sans installer PHP)

Depuis la racine du dépôt (`dmp/`) :

    docker run --rm -v "${PWD}:/app" -w /app composer:2 create-project laravel/laravel tmp-api
    # puis déplacer le contenu de tmp-api/ dans api-dmp/ (sans écraser Dockerfile et .dockerignore)

Sous Windows PowerShell, `${PWD}` fonctionne tel quel ; sous cmd, utilisez `%cd%`.

## 2. Ajouter l'API et la route de test

    docker run --rm -v "${PWD}/api-dmp:/app" -w /app composer:2 php artisan install:api --no-interaction
    docker run --rm -v "${PWD}/api-dmp:/app" -w /app composer:2 php artisan config:publish cors

- Copier le contenu de `routes-api.health.php.txt` dans `routes/api.php`
  (en gardant `use` en haut), et ajouter dans `config/services.php` :
  `'anip' => ['url' => env('ANIP_URL')],`
- Dans `config/cors.php` : `'allowed_origins' => [env('FRONTEND_ORIGIN')]`
  (exigence ENF-07).

Si `composer` se plaint de l'extension PHP (`ext-...`), ajoutez `--ignore-platform-reqs`.

## 3. Générer la clé de l'application

    docker compose build api-dmp
    docker compose run --rm --no-deps api-dmp php artisan key:generate --show

Copier la valeur affichée (`base64:...`) dans `APP_KEY=` du fichier `.env`.
