# syntax=docker/dockerfile:1
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-slim
ENV HARDHAT_DISABLE_TELEMETRY_PROMPT=true
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npx hardhat compile
EXPOSE 8545
# Le réseau vit en mémoire : un redémarrage du conteneur repart d'une chaîne vide.
CMD ["npx", "hardhat", "node", "--hostname", "0.0.0.0"]
