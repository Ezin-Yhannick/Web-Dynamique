# syntax=docker/dockerfile:1
ARG NODE_VERSION=22

# Développement : serveur Vite (utilisé par docker-compose.dev.yml)
FROM node:${NODE_VERSION}-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
EXPOSE 80
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]

# Construction : l'URL de l'API est figée dans le bundle (variable lue par le navigateur)
FROM dev AS build
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production (cible par défaut) : fichiers statiques servis par Nginx
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
