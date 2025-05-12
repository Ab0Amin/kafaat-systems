# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only necessary files for dependency installation
COPY apps/hr-core-client/.next/standalone/apps/hr-core-client/package*.json ./
COPY nx.json tsconfig.base.json eslint.config.mjs ./

# Install dependencies
RUN npm install --omit=dev --legacy-peer-deps


# Runner stage (using a smaller base image)
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1


# Copy only the necessary files from the build stage
COPY --from=builder /apps/hr-core-client/.next/standalone/* . 
# COPY --from=builder --chown=app:app /app/apps/hr-core-client/public ./public 
RUN chown -R node:node .


# Switch to non-root user
USER node

EXPOSE 3000

CMD ["node", "server.js"]