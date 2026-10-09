# syntax=docker/dockerfile:1
#
# Docs (docs-mfe) — production image.
# Build context: repository root.
#   docker build -f docker/docs-mfe.Dockerfile -t tg-labs/docs-mfe .

ARG NODE_VERSION=24.21.0
ARG NGINX_VERSION=1.29

# ---- 1. Install dependencies (cached while the lockfile is unchanged) ----
FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /workspace
COPY package.json package-lock.json ./
# Optional extra CA bundle for TLS-intercepting proxies (never stored in the image):
#   docker build --secret id=extra_ca,src=./corp-ca.pem ...
RUN --mount=type=secret,id=extra_ca,required=false \
    if [ -s /run/secrets/extra_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/extra_ca; fi \
    && npm ci --no-audit --no-fund

# ---- 2. Build the application with Nx ----
FROM deps AS build
ENV CI=true NX_DAEMON=false NX_NO_CLOUD=true
COPY nx.json tsconfig.base.json .postcssrc.json eslint.config.mjs vitest.config.mts ./
COPY libs ./libs
COPY apps/docs-mfe ./apps/docs-mfe
RUN npx nx build docs-mfe --configuration=production --skip-nx-cache

# ---- 3. Serve static assets with unprivileged Nginx (runs as uid 101) ----
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION}-alpine AS runtime
COPY infra/nginx/app/remote.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build --chown=101:101 /workspace/dist/apps/docs-mfe/browser /usr/share/nginx/html

# Origin allowed to fetch this remote's federation files ("*" = any origin).
ENV REMOTE_CORS_ORIGIN=*

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
