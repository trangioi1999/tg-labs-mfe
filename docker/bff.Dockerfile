# syntax=docker/dockerfile:1
#
# BFF (NestJS) — production image.
# Build context: repository root.
#   docker build -f docker/bff.Dockerfile -t tg-labs/bff .

ARG NODE_VERSION=24.21.0

# ---- 1. Install all dependencies (needed for the TypeScript build) ----
FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /workspace
COPY package.json package-lock.json ./
# Optional extra CA bundle for TLS-intercepting proxies (never stored in the image):
#   docker build --secret id=extra_ca,src=./corp-ca.pem ...
RUN --mount=type=secret,id=extra_ca,required=false \
    if [ -s /run/secrets/extra_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/extra_ca; fi \
    && npm ci --no-audit --no-fund

# ---- 2. Compile with tsc via Nx ----
FROM deps AS build
ENV CI=true NX_DAEMON=false NX_NO_CLOUD=true
COPY nx.json tsconfig.base.json eslint.config.mjs vitest.config.mts ./
COPY libs/shared-models ./libs/shared-models
COPY backend/bff ./backend/bff
RUN npx nx build bff --skip-nx-cache

# ---- 3. Production-only node_modules ----
FROM node:${NODE_VERSION}-bookworm-slim AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
# Optional extra CA bundle for TLS-intercepting proxies (never stored in the image):
#   docker build --secret id=extra_ca,src=./corp-ca.pem ...
RUN --mount=type=secret,id=extra_ca,required=false \
    if [ -s /run/secrets/extra_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/extra_ca; fi \
    && npm ci --omit=dev --ignore-scripts --no-audit --no-fund

# ---- 4. Runtime (non-root `node` user) ----
FROM node:${NODE_VERSION}-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /workspace/dist/backend/bff ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "backend/bff/src/main.js"]
