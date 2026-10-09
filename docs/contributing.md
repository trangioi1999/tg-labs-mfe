# Contributing

## Branches

- `main` is the integration branch (`defaultBase` in `nx.json`).
- Work on short-lived feature branches and open a pull request into `main`.
- CI must be green before merging.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are written in **English**.

```text
<type>(<optional scope>): <imperative summary, lower case, no period>

<optional body: what and why, wrapped at ~72 characters>
```

Types used in this repository:

| Type       | Use for                                                 |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new user-facing capability                            |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation only                                      |
| `style`    | Formatting only (Prettier), no behaviour change         |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test`     | Adding or fixing tests                                  |
| `build`    | Build system, Dockerfiles, dependencies                 |
| `ci`       | GitHub Actions workflows                                |
| `chore`    | Tooling and maintenance                                 |

Suggested scopes:

- one per app: `shell`, `blog`, `docs`, `tools`, `playground`, `bff`
- shared libraries: `shared-ui`, `shared-layout`, `shared-models`, `shared-utils`, `shared-config`
- cross-cutting areas: `federation`, `docker`, `infra`, `deps`

Examples from the history:

```text
feat(bff): add NestJS backend-for-frontend with health endpoint
fix(federation): isolate development build output from production builds
build(docker): add multi-stage images for shell, remotes and BFF
```

Use one commit per logical change. Do not mix formatting-only changes with behaviour changes.

## Before you push

Run what CI runs:

```bash
npx nx format:check
npx nx affected -t lint test build
```

To fix formatting:

```bash
npx nx format:write
```

## Code conventions

- **Angular:**
  - standalone components, signals (`input()`, `computed()`), new control flow (`@if`, `@for`);
  - `ChangeDetectionStrategy.OnPush`;
  - selectors prefixed with `tg`.
- **TypeScript:** strict mode is on everywhere. Avoid `any` (including `$any()` in templates).
- **Boundaries:**
  - Domain logic stays in its remote.
  - Shared libraries hold only reusable, domain-agnostic code.
  - `nx lint` enforces this with tags (see [architecture.md](architecture.md#shared-libraries-and-boundaries)).
- **Remotes:**
  - Never import another remote or the Shell.
  - Talk to the Shell only through the route contract in `@tg-labs/shared-config`.
- **Styling:**
  - Tailwind utilities, using the tokens in `libs/shared-ui/src/styles/tokens.css`.
  - When a `routerLinkActive` class must override a base class for the same property, use Tailwind's important suffix (e.g. `text-zinc-950!`).
- **Tests:**
  - Put pure logic in plain TypeScript files with Vitest specs.
  - Component specs cover rendering and user interaction.
- **Secrets:** never commit `.env` files; `.env.example` documents every variable.
