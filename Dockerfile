#syntax=docker/dockerfile:1.7-labs
FROM node:lts AS builder
WORKDIR /app

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:lts AS final
WORKDIR /app
COPY --from=builder /app/dist /app/frontend/dist
COPY package*.json ./
RUN npm ci --omit=dev
COPY --exclude=frontend . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server/index.js"]