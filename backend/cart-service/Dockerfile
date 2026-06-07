FROM node:20-alpine AS base
WORKDIR /app

# ── Build stage ────────────────────────────────────────────────────────────
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY src ./src

# ── Production stage ────────────────────────────────────────────────────────
FROM base AS production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

# Health check: test if service is ready
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (r) => { if (r.statusCode === 200) process.exit(0); else process.exit(1); }).on('error', () => process.exit(1))"

EXPOSE 3002
CMD ["node", "src/index.js"]
