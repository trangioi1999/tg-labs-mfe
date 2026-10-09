# Getting started

This guide takes you from a fresh clone to the full site running locally.

## 1. Install the toolchain

| Tool    | Version              | Check                    |
| ------- | -------------------- | ------------------------ |
| Node.js | 24.21.0 (`.nvmrc`)   | `node -v`                |
| npm     | 11 (ships with Node) | `npm -v`                 |
| Git     | any recent           | `git --version`          |
| Docker  | optional, Compose v2 | `docker compose version` |

With nvm:

```bash
nvm install   # reads .nvmrc
nvm use
```

Node 22 releases older than 22.22.3 are **not** supported by Angular 22.

## 2. Clone and install

```bash
git clone https://github.com/trangioi1999/tg-labs-mfe.git
cd tg-labs-mfe
npm ci
```

Always use `npm ci` (not `npm install`) so the exact versions from
`package-lock.json` are installed.

## 3. Run the site

```bash
npm start
```

This starts five dev servers. Wait until every app logs its local URL, then
open **http://localhost:4200**.

| What you see                   | Served by               |
| ------------------------------ | ----------------------- |
| Header, footer, home page, 404 | `shell` (4200)          |
| `/blog/**`                     | `blog-mfe` (4201)       |
| `/docs/**`                     | `docs-mfe` (4202)       |
| `/tools/**`                    | `tools-mfe` (4203)      |
| `/playground/**`               | `playground-mfe` (4204) |

Optional: start the BFF in a second terminal and open
http://localhost:3000/api/health.

```bash
npx nx serve bff
```

## 4. Make a first change

1. Open `apps/tools-mfe/src/app/tools.catalog.ts` and edit a tool summary.
2. The Tools dev server rebuilds automatically. Reload http://localhost:4200/tools.
3. Run the checks for what you changed:

   ```bash
   npx nx affected -t lint test build
   ```

## 5. Explore the workspace

```bash
npx nx show projects        # all projects
npx nx show project shell   # targets of one project
npx nx graph                # interactive dependency graph
```

## 6. Try the production setup (optional)

```bash
cp .env.example .env
docker compose --env-file .env -f compose/docker-compose.yml up --build -d
```

Open **http://localhost:8080**. See [deployment.md](deployment.md) for details.

## Next steps

- How the pieces fit together: [architecture.md](architecture.md)
- Daily workflow and checks: [local-development.md](local-development.md)
- Conventions before you commit: [contributing.md](contributing.md)
