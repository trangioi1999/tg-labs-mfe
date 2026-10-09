# Troubleshooting

Known problems and their fixes. Most of them were hit while setting up the project.

## Angular CLI refuses to run / "Node.js version … is not supported"

Angular 22 requires Node `^22.22.3 || ^24.15.0`. Switch to the pinned version:

```bash
nvm install && nvm use   # Node 24.21.0 from .nvmrc
```

## `npm ci` prints `install-scripts … not yet covered by allowScripts`

These are warnings from npm 11, and they can be ignored. The build does not need those install scripts: esbuild and the other native tools ship prebuilt binaries as optional dependencies.

## A section shows "… is temporarily unavailable"

The Shell could not load that remote's `remoteEntry.json`. Check, in order:

1. **Is the remote running?** For example, `curl http://localhost:4201/remoteEntry.json` locally, or `docker compose ps` in Docker.
2. **Does the Shell's manifest point to the right URL?**
   - locally: `apps/shell/public/federation.manifest.json`;
   - in Docker: `curl http://localhost:8080/federation.manifest.json`.
3. **Does the manifest key match the remote's name?** It must equal `name` in that remote's `federation.config.mjs` (e.g. `blog-mfe`).

The router caches the fallback for the session. After the remote is back, reload the page (or click **Try again**).

## Browser console: `ReferenceError: ngDevMode is not defined`

The dev server is serving production-built shared Angular bundles. Development builds write to `dist/dev/apps/*` precisely to avoid this. If it still happens:

```bash
rm -rf dist node_modules/.cache/native-federation
npm start
```

## Shell header or footer layout breaks after opening a remote

A remote stylesheet is overriding Shell utilities. Each remote's `<name>-layout.css` must:

- wrap `@tailwind utilities` in its root selector (e.g. `tg-blog-layout { … }`), and
- never import `tailwindcss` (with preflight) or `base.css`.

See [architecture.md](architecture.md#styling).

## A Tailwind class has no effect inside a remote

- **The class name is built dynamically.** Tailwind cannot see string concatenations; write full class names in templates or in TypeScript string constants.
- **The file is outside the scanned sources.** Remotes scan their own `src/` plus `libs/shared-ui` and `libs/shared-layout`. Add an `@source` line in the remote's layout CSS if needed.
- **An active-state class conflicts with a base class for the same property.** Use the important suffix (`border-accent-600!`).

## Port already in use

Find and stop the old dev server (ports 4200–4204 and 3000):

```bash
lsof -i :4200        # or: fuser -k 4200/tcp
```

## `nx affected` fails with `ambiguous argument 'main'`

The `main` branch does not exist locally. Fetch it, or pass explicit bases:

```bash
git fetch origin main
npx nx affected -t lint test build --base=origin/main --head=HEAD
```

## Docker build fails with `SELF_SIGNED_CERT_IN_CHAIN`

A proxy on your network intercepts TLS. Pass its CA certificate as a build secret. It is used only during `npm ci` and is not stored in the image:

```bash
docker build --secret id=extra_ca,src=./corp-ca.pem -f docker/shell.Dockerfile -t tg-labs/shell:local .
```

## Docker Hub returns `429 Too Many Requests`

Anonymous pulls are rate-limited. Run `docker login`, or wait and retry.

## Gateway returns 502 for `/mfe/<remote>/…` or `/api/…`

The upstream container is down or unhealthy. The gateway itself keeps running (upstreams are resolved per request). Check:

```bash
docker compose --env-file .env -f compose/docker-compose.yml ps
docker compose --env-file .env -f compose/docker-compose.yml logs <service>
```

## Nx tries to connect to `cloud.nx.app`

`nx.json` sets `"neverConnectToCloud": true`. If you still see attempts, export `NX_NO_CLOUD=true` (CI already does).
