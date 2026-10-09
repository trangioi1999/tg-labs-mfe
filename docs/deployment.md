# Deployment

## Images

| Image            | Dockerfile                         | Runtime                                    | Port |
| ---------------- | ---------------------------------- | ------------------------------------------ | ---- |
| `shell`          | `docker/shell.Dockerfile`          | `nginxinc/nginx-unprivileged` (uid 101)    | 8080 |
| `blog-mfe`       | `docker/blog-mfe.Dockerfile`       | `nginxinc/nginx-unprivileged` (uid 101)    | 8080 |
| `docs-mfe`       | `docker/docs-mfe.Dockerfile`       | `nginxinc/nginx-unprivileged` (uid 101)    | 8080 |
| `tools-mfe`      | `docker/tools-mfe.Dockerfile`      | `nginxinc/nginx-unprivileged` (uid 101)    | 8080 |
| `playground-mfe` | `docker/playground-mfe.Dockerfile` | `nginxinc/nginx-unprivileged` (uid 101)    | 8080 |
| `bff`            | `docker/bff.Dockerfile`            | `node:24.21.0-bookworm-slim` (user `node`) | 3000 |

All images:

- are multi-stage builds: `npm ci` → `nx build <app>` → runtime;
- are built with the **repository root** as the build context;
- contain no secrets or environment-specific values;
- define a `HEALTHCHECK` (`/healthz` for Nginx, `/api/health` for the BFF).

Build a single image:

```bash
docker build -f docker/blog-mfe.Dockerfile -t tg-labs/blog-mfe:local .
```

Behind a TLS-intercepting corporate proxy, pass its CA as a build secret. It is used only by `npm ci` and is not stored in the image:

```bash
docker build --secret id=extra_ca,src=./corp-ca.pem -f docker/shell.Dockerfile -t tg-labs/shell:local .
```

## Runtime configuration

| Variable                      | Service | Default                            |
| ----------------------------- | ------- | ---------------------------------- |
| `ENABLED_REMOTES`             | shell   | `all` (or e.g. `blog,tools`)       |
| `REMOTE_BLOG_URL`             | shell   | `/mfe/blog/remoteEntry.json`       |
| `REMOTE_DOCS_URL`             | shell   | `/mfe/docs/remoteEntry.json`       |
| `REMOTE_TOOLS_URL`            | shell   | `/mfe/tools/remoteEntry.json`      |
| `REMOTE_PLAYGROUND_URL`       | shell   | `/mfe/playground/remoteEntry.json` |
| `REMOTE_CORS_ORIGIN`          | remotes | `*`                                |
| `PORT`, `APP_VERSION`         | bff     | `3000`, `dev`                      |
| `GATEWAY_PORT`                | compose | `8080`                             |
| `IMAGE_REGISTRY`, `IMAGE_TAG` | compose | `tg-labs`, `local`                 |

The Shell's `docker/scripts/40-federation-manifest.sh` writes `federation.manifest.json` from the `REMOTE_*_URL` variables on every container start. To move a remote to another host or CDN, change its URL. No rebuild is needed.

When remotes are served from a different origin than the Shell:

- use absolute `https://` URLs, and
- set `REMOTE_CORS_ORIGIN` to the Shell's origin.

## Docker Compose

```bash
cp .env.example .env

# Build and start everything; open http://localhost:8080
docker compose --env-file .env -f compose/docker-compose.yml up --build -d

# Also publish each container directly (8081-8085, 3000) for debugging
docker compose --env-file .env -f compose/docker-compose.yml -f compose/docker-compose.dev.yml up -d

# Status / logs / stop
docker compose --env-file .env -f compose/docker-compose.yml ps
docker compose --env-file .env -f compose/docker-compose.yml logs -f gateway
docker compose --env-file .env -f compose/docker-compose.yml down
```

Start-up order: the gateway waits for the Shell to report healthy. Remotes and the BFF are not hard dependencies:

- the gateway resolves upstreams per request, and
- the Shell shows a fallback for any missing remote.

### Verified behaviour (initial setup)

- All six images built and all seven services reported `healthy`. In that sandbox, images were built with `docker build --secret id=extra_ca,...` because of a TLS-intercepting proxy, then started with `up --no-build`.
- Through `http://localhost:8080`:
  - `/`, `/blog/<slug>` and unknown paths return the Shell's `index.html`;
  - `/mfe/<remote>/remoteEntry.json` returns JSON with `no-cache` and CORS headers;
  - hashed bundles return `immutable` caching;
  - `/api/health` returns the BFF status.
- Browser checks (navigation, refresh on nested routes, tools, 404, theme, mobile) passed. Stopping `docs-mfe` produced the fallback page while the other sections kept working.
- Nginx containers run as uid 101 and the BFF as uid 1000.

## Gateway routing

`infra/nginx/conf.d/gateway.conf` (mounted read-only into the gateway container):

| Location           | Upstream               | Notes                            |
| ------------------ | ---------------------- | -------------------------------- |
| `= /healthz`       | gateway itself         | Health check                     |
| `/mfe/blog/`       | `blog-mfe:8080/`       | Prefix stripped                  |
| `/mfe/docs/`       | `docs-mfe:8080/`       | Prefix stripped                  |
| `/mfe/tools/`      | `tools-mfe:8080/`      | Prefix stripped                  |
| `/mfe/playground/` | `playground-mfe:8080/` | Prefix stripped                  |
| `/api/`            | `bff:3000`             | Path preserved (`/api/health`)   |
| `/`                | `shell:8080`           | SPA fallback serves `index.html` |

Docker service names are only used **between containers**. The browser only sees the gateway's origin and the relative `/mfe/...` URLs.

## CI/CD

`.github/workflows/ci.yml` runs on every push and pull request:

1. `npm ci`, then `nx format:check`.
2. Lint, test and build:
   - **Pull requests:** `nx affected` against the PR base.
   - **`main`:** `nx affected` since the last green run (`nrwl/nx-set-shas`).
   - **Other branches:** `run-many` over all projects.
3. Build all six Docker images (not pushed) and validate every Compose combination.

`.github/workflows/deploy.yml` (_Publish images_) is **manual** (`workflow_dispatch`). It pushes images to `ghcr.io/<owner>/tg-labs/<app>:<sha>`. It does not touch any server.

## Cloudflare Pages (single-project staging)

The quickest way to publish the frontend: no VPS, no domain required. One Pages project serves the Shell and every Remote from the same origin, using the gateway's layout (`/mfe/<remote>/`), so no CORS configuration is needed.

```bash
npm run build:pages
```

This runs the five production builds and then `tools/scripts/assemble-pages.mjs`, which produces `dist/pages/`:

| Path                        | Content                                          |
| --------------------------- | ------------------------------------------------ |
| `/`                         | Shell build (`index.html`, bundles)              |
| `/mfe/<remote>/`            | Each remote's federation build                   |
| `/federation.manifest.json` | Same-origin URLs (`/mfe/blog/remoteEntry.json`…) |
| `/_headers`                 | `no-cache` for `*.json`, `immutable` for JS/CSS  |

Cloudflare deploys it as a **static-assets-only Worker** configured in `wrangler.jsonc`:

- assets are served from `dist/pages`;
- `not_found_handling: single-page-application` returns `index.html` for page routes such as `/blog/<slug>`.

No Worker code runs on a request. The dashboard's import flow creates a Worker, not a classic Pages project.

To create it, go to **Workers & Pages → Create → Import a repository**, pick `tg-labs-mfe`, then set:

| Setting              | Value                                          |
| -------------------- | ---------------------------------------------- |
| Project name         | `tg-labs` (matches `name` in `wrangler.jsonc`) |
| Production branch    | `main`                                         |
| Build command        | `npm run build:pages`                          |
| Deploy command       | `npx wrangler deploy`                          |
| Environment variable | `NODE_VERSION` = `24.21.0`                     |

The `_headers` file in `dist/pages` sets the cache headers. Every push to `main` redeploys.

To publish only some sections, add the build variable `ENABLED_REMOTES` (e.g. `blog,tools`) in the Cloudflare project settings and redeploy. The other sections disappear from the site.

Validate locally without deploying:

```bash
npm run build:pages
npx wrangler deploy --dry-run
```

Trade-offs:

- All five apps are deployed together.
- The BFF (`/api`) is not part of this deployment.

Once stable, either split the remotes into separate Pages projects (absolute URLs in the manifest, plus CORS headers) or move to the VPS setup. No application code changes are needed for either.

## VPS rollout (next step)

Production deployment is intentionally not automated yet. The suggested path:

1. **Provision the server.** A Linux VPS with Docker Engine and the Compose plugin, a non-root deploy user, and a firewall allowing only 22, 80 and 443.
2. **Copy configuration.** Put `compose/`, `infra/nginx/` and a `.env` on the server, with:
   - `IMAGE_REGISTRY=ghcr.io/<owner>/tg-labs`
   - `IMAGE_TAG=<sha>`
3. **Pull and start:**
   ```bash
   docker compose --env-file .env -f compose/docker-compose.yml -f compose/docker-compose.prod.yml pull
   docker compose --env-file .env -f compose/docker-compose.yml -f compose/docker-compose.prod.yml up -d --no-build
   ```
4. **Put Cloudflare in front** (DNS, TLS, CDN). Proxy the domain to the VPS and either:
   - publish the gateway on port 80 behind Cloudflare _Full (strict)_ with an origin certificate on a TLS-terminating Nginx, or
   - use a Cloudflare Tunnel.

   Cache `/mfe/*` hashed assets at the edge, and respect `no-cache` on `*.json` and HTML.

5. **Automate.** Once SSH credentials are stored as repository secrets, add a job to `deploy.yml` that runs step 3 over SSH after publishing.
