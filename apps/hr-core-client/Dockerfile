FROM node:lts-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY nx.json tsconfig.base.json eslint.config.mjs ./
COPY apps/hr-core-client ./apps/hr-core-client
COPY libs ./libs

RUN npm ci --omit=dev

RUN npm run build:frontend


FROM node:lts-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 app && adduser -S -u 1001 -G app app

COPY --from=builder --chown=app:app /app/apps/hr-core-client/.next/standalone ./
COPY --from=builder --chown=app:app /app/apps/hr-core-client/public ./public

USER app
EXPOSE 3000

CMD ["node", "server.js"]
