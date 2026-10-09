# bff — Backend-for-Frontend (NestJS)

Minimal NestJS 12 service that will sit between the browser and internal
services. The gateway forwards `/api/*` here.

| Endpoint          | Description            |
| ----------------- | ---------------------- |
| `GET /api/health` | Liveness/health status |

```bash
npx nx build bff     # tsc -> dist/backend/bff
npx nx serve bff     # http://localhost:3000/api/health
npx nx test bff
```

Notes:

- NestJS 12 is ESM-only, so the BFF is compiled with `tsc` (`module: nodenext`)
  rather than esbuild: Nest's dependency injection relies on
  `emitDecoratorMetadata`, which esbuild does not support.
- The compiled entry point is `dist/backend/bff/backend/bff/src/main.js`
  (`rootDir` is the workspace root so shared contract types are type-checked).
- Only **type** imports from `@tg-labs/*` libraries are allowed here; path
  aliases are not rewritten in the compiled output.
