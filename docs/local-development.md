# Local development

## Requirements

- Node.js 24.21.0 (`nvm use` reads `.nvmrc`)
- npm 11

```bash
npm ci
```

> npm 11 may print `install-scripts ... not yet covered by allowScripts`
> warnings. The build does not depend on those scripts: esbuild ships
> platform binaries as optional dependencies.

## Ports

| App              | URL                              | Notes             |
| ---------------- | -------------------------------- | ----------------- |
| `shell`          | http://localhost:4200            | Full site         |
| `blog-mfe`       | http://localhost:4201/blog       | Standalone remote |
| `docs-mfe`       | http://localhost:4202/docs       | Standalone remote |
| `tools-mfe`      | http://localhost:4203/tools      | Standalone remote |
| `playground-mfe` | http://localhost:4204/playground | Standalone remote |
| `bff`            | http://localhost:3000/api/health | NestJS BFF        |

Remote ports are defined in each app's `project.json` (`serve-original.options.port`). The Shell finds them through `apps/shell/public/federation.manifest.json`. Change both together.

## Running

```bash
# Shell + all remotes
npm start

# A single app
npx nx serve tools-mfe

# BFF (compiles with tsc first)
npx nx serve bff
```

Development builds write to `dist/dev/apps/<app>` and production builds to
`dist/apps/<app>`. The Native Federation dev server serves federation files
from its output folder, so the two are kept apart: running `nx build` never
replaces the dev-mode Angular bundles of a running dev server.

The Native Federation dev server rebuilds on change. Reload the Shell to pick up a rebuilt remote.

When the Shell runs alone, every remote section shows its "temporarily unavailable" page. This is expected: start the remotes you need.

## Hiding sections locally

The Shell only shows the remotes listed in `apps/shell/public/federation.manifest.json`. To hide a section while developing, remove its entry; restore it before committing. See [architecture.md](architecture.md#enabling-and-disabling-sections).

When the Shell runs alone, the listed remotes are fetched only when their section is opened. Sections whose dev server is not running show the "temporarily unavailable" page.

## Quality checks

```bash
npx nx run-many -t lint
npx nx run-many -t test
npx nx run-many -t build
npx nx format:check
npx nx affected -t lint test build   # compares against defaultBase (main)
```

Unit tests use Vitest:

- Angular apps use `@angular/build:unit-test` with jsdom.
- Framework-free libraries and the BFF use `@nx/vitest`.

## Verifying federation manually

With every dev server running:

1. `curl -s http://localhost:4203/remoteEntry.json` returns JSON exposing `./routes`.
2. Open http://localhost:4200, click each primary navigation item, and confirm that the header and footer stay in place.
3. Open http://localhost:4200/blog/angular-signals-in-practice directly and refresh. The article renders.
4. Open http://localhost:4200/does-not-exist. You get the Shell's 404.
5. On http://localhost:4200/tools/json-formatter, paste `{"a": }`. The tool reports `line 1, column 7`.
6. Stop `docs-mfe` and open http://localhost:4200/docs. You get the fallback page, and the other sections still work.

During the initial setup, these checks plus title, theme, mobile-layout and console-error checks were automated in a local Playwright smoke script. They passed against both the dev servers and the Docker Compose stack. Adding that suite to the repository and CI is the next testing milestone.

## Adding a new remote

1. `npx nx g @nx/angular:application --directory=apps/<name>-mfe --name=<name>-mfe --port=<port> --prefix=tg --e2eTestRunner=none --unitTestRunner=vitest-angular`
2. `npx nx g @angular-architects/native-federation:init --project=<name>-mfe --port=<port> --type=remote`
3. In `federation.config.mjs`:
   - expose `./routes`,
   - set `sharedMappings: []`,
   - copy the `skip` list from another remote.
4. Add the remote to `REMOTES` in `libs/shared-config` and a `loadRemoteRoutes` route in the Shell.
5. Add it to `apps/shell/public/federation.manifest.json`.
6. Add a scoped `<name>-layout.css` (copy an existing one and change the root selector).
7. Add `docker/<name>-mfe.Dockerfile`, a Compose service, a gateway `/mfe/<name>/` location and a `REMOTE_<NAME>_URL` entry in the Shell manifest script.
