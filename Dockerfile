# =====================================================================
# Stage 1 — Build
# =====================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Cache de dependencias
COPY package*.json ./
RUN npm ci

# Compilamos
COPY . .
RUN npm run build && npm prune --omit=dev

# =====================================================================
# Stage 2 — Runtime (imagen liviana, solo deps de producción)
# =====================================================================
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Usuario no-root para mejor seguridad
RUN addgroup -S nestjs && adduser -S nestjs -G nestjs

COPY --from=builder --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/package.json ./package.json

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main.js"]
