# TG Labs documentation

Start here. Every guide documents configuration and commands that exist in
this repository.

| Guide                                     | Read it when you want to…                                        |
| ----------------------------------------- | ---------------------------------------------------------------- |
| [Getting started](getting-started.md)     | Clone, install and see the whole site running in a few minutes   |
| [Local development](local-development.md) | Work on one app, run checks, verify federation, add a remote     |
| [Architecture](architecture.md)           | Understand the Shell/Remote model, routing contract and styling  |
| [Deployment](deployment.md)               | Build images, run Docker Compose, configure the gateway, deploy  |
| [Contributing](contributing.md)           | Follow the branch, commit and quality conventions                |
| [Troubleshooting](troubleshooting.md)     | Fix known problems (Node version, stale bundles, CSS, Docker, …) |

Project-level overview, versions and roadmap: [../README.md](../README.md).

Per-project notes:

- [backend/bff](../backend/bff/README.md): NestJS BFF
- [backend/api-gateway](../backend/api-gateway/README.md),
  [backend/services/content-service](../backend/services/content-service/README.md): planned Java services
- [libs/shared-ui](../libs/shared-ui/README.md), [libs/shared-layout](../libs/shared-layout/README.md),
  [libs/shared-models](../libs/shared-models/README.md), [libs/shared-utils](../libs/shared-utils/README.md),
  [libs/shared-config](../libs/shared-config/README.md): shared libraries
