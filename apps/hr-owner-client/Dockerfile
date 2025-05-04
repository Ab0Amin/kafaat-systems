# ========================
# Build stage
# ========================
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json tsconfig.base.json eslint.config.mjs ./
COPY apps/hr-core-client ./apps/hr-core-client
# COPY libs ./libs

RUN npm install
RUN npm run build:frontend

# ========================
# Production stage
# ========================
FROM node:lts-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 app && adduser -S -u 1001 -G app app

# استخدم --chown بدل RUN chown لتقليل layer size
COPY --from=builder --chown=app:app /app/apps/hr-core-client/.next/standalone/apps/hr-core-client ./
COPY --from=builder --chown=app:app /app/apps/hr-core-client/public ./public
# You likely don't need these in standalone mode
# COPY --chown=app:app apps/hr-core-client/package.json ./package.json
# COPY --chown=app:app apps/hr-core-client/next.config.js ./next.config.js
# COPY --chown=app:app package-lock.json ./package-lock.json
COPY --from=builder --chown=app:app /app/apps/hr-core-client/.next/standalone/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/apps/hr-core-client/.next/standalone/apps/hr-core-client/server.js ./server.js
# DO NOT RUN npm ci --omit=dev

USER app

EXPOSE 3000
CMD ["node", "server.js"]