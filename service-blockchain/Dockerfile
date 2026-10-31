# syntax=docker/dockerfile:1
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
COPY . .
USER node
EXPOSE 3000
# Le point d'entrée est défini par le script « start » de package.json
CMD ["npm", "start"]
