# ========================
# Install production deps only (no dev)
# ========================
FROM node:lts-alpine as deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# استخدم فقط package.json الخاص بالتطبيق
COPY apps/hr-core-server/dist/package*.json ./
# COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps



# ========================
# Production stage (clean)
# ========================
FROM node:lts-alpine as runner

WORKDIR /app

# استخدام dumb-init لتحسين التعامل مع signals
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV PORT=4000

# انسخ فقط اللي محتاجه وقت التشغيل
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
# COPY apps/hr-core-server/dist/* . 

# تغيير صلاحيات التشغيل
# RUN chown -R node:node .
COPY --chown=node:node apps/hr-core-server/dist/* .


USER node

EXPOSE 4000

CMD ["dumb-init", "node", "main.js"]
