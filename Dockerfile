#syntax=docker/dockerfile:1.7-labs
FROM node:lts-alpine AS builder
WORKDIR /app

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:lts-alpine AS final
WORKDIR /app
COPY --from=builder /app/dist /app/frontend/dist
COPY package*.json ./
COPY --exclude=frontend . .
RUN npm install
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "server/index.js"]