# ========================
# Build stage
# ========================
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json tsconfig.base.json eslint.config.mjs ./
COPY apps/hr-core-server ./apps/hr-core-server
# COPY libs ./libs

RUN npm install
RUN npm run build:backend

# ========================
# Production stage
# ========================
FROM node:lts-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup -g 1001 app && adduser -S -u 1001 -G app app

# Copy the built backend artifacts directly from the 'dist' folder
COPY --from=builder --chown=app:app /app/apps/hr-core-server/dist ./dist
# COPY --from=builder --chown=app:app /app/apps/hr-core-server/dist/main.js ./main.js

# Copy package.json and package-lock.json to the root of /app
COPY --from=builder --chown=app:app /app/apps/hr-core-server/dist/package.json ./package.json
COPY --from=builder --chown=app:app /app/apps/hr-core-server/dist/package-lock.json ./package-lock.json

RUN npm ci --omit=dev

USER app

EXPOSE 4000

CMD ["node", "dist/main.js"]