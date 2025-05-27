# === Build Stage ===
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/hr-core-client ./apps/hr-core-client
COPY nx.json tsconfig.base.json ./
COPY eslint.config.mjs ./
# Install dependencies
RUN npm install --legacy-peer-deps

# Build the Next.js app via NX
RUN npx nx build @kafaat-systems/hr-core-client

# === Run Stage ===
FROM node:20-alpine AS runner

WORKDIR /app




ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the standalone output
# COPY --from=builder /app/apps/hr-core-client/.next/standalone/ ./
COPY --from=builder /app/apps/hr-core-client/.next/standalone/apps/hr-core-client ./
COPY --from=builder /app/apps/hr-core-client/.next/standalone/node_modules ./node_modules
COPY --from=builder /app/apps/hr-core-client/.next/standalone/package.json ./

# COPY --from=builder /app/apps/hr-core-client/.next/static/ /apps/hr-core-client/.next/static/
COPY --from=builder /app/apps/hr-core-client/.next/static ./public/static


# Copy public files if needed
# COPY --from=builder /app/apps/hr-core-client/public ./public

USER node
EXPOSE 3000

CMD ["node", "server.js"]
