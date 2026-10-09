# shared-config

Shared **non-secret** configuration:

- `SITE` – brand constants.
- `REMOTES` / `REMOTE_ROUTES_MODULE` – the route contract between the Shell and
  each Remote (federation name, mount path, exposed module).

Never put secrets or environment-specific URLs here. Remote entry URLs live in
the Shell's runtime `federation.manifest.json`.
