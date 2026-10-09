import type { Article, Category } from '@tg-labs/shared-models';

/**
 * Local mock content so the Blog renders without any backend. The shape is
 * the shared `Article` contract, which the future Content Service will serve.
 */
export const CATEGORIES: readonly Category[] = [
  { slug: 'frontend-architecture', name: 'Frontend Architecture', description: 'Micro frontends, monorepos and module boundaries.' },
  { slug: 'angular', name: 'Angular', description: 'Signals, standalone APIs, routing and performance.' },
  { slug: 'backend', name: 'Backend & APIs', description: 'BFFs, gateways and Spring Boot services.' },
  { slug: 'devops', name: 'DevOps & Infrastructure', description: 'Docker, Nginx, CI/CD and VPS operations.' },
  { slug: 'databases', name: 'Databases', description: 'PostgreSQL modelling, indexing and migrations.' },
  { slug: 'tooling', name: 'Tooling', description: 'Nx, build pipelines and developer experience.' },
];

const AUTHOR = { name: 'TG Labs', handle: 'tglabs' };

export const ARTICLES: readonly Article[] = [
  {
    slug: 'micro-frontends-with-native-federation',
    title: 'Micro Frontends with Angular Native Federation',
    excerpt:
      'How a dynamic host, a runtime manifest and route-level contracts keep independently deployed Angular apps feeling like one product.',
    category: 'frontend-architecture',
    tags: ['angular', 'native-federation', 'architecture'],
    publishedAt: '2026-09-28',
    readingMinutes: 9,
    author: AUTHOR,
    featured: true,
    body: [
      { kind: 'paragraph', text: 'Native Federation brings the Module Federation mental model to any ESM build tool. Instead of a webpack runtime, it relies on browser-native import maps: each application publishes a remoteEntry.json describing what it exposes and which shared packages it needs.' },
      { kind: 'heading', level: 2, text: 'A dynamic host' },
      { kind: 'paragraph', text: 'The Shell does not know remote URLs at build time. It fetches federation.manifest.json when it boots, which means the same Shell image can run against local dev servers, a Docker network or a production CDN.' },
      { kind: 'code', language: 'json', code: '{\n  "blog-mfe": "/mfe/blog/remoteEntry.json",\n  "docs-mfe": "/mfe/docs/remoteEntry.json"\n}' },
      { kind: 'heading', level: 2, text: 'Routes as the contract' },
      { kind: 'paragraph', text: 'Each remote exposes a single ./routes module. The Shell mounts it under a top-level path and never imports remote internals. If a remote is down, the Shell swaps in a fallback route and the rest of the site keeps working.' },
      { kind: 'list', items: ['Keep the Shell thin: layout, navigation, error states.', 'Share framework packages as singletons; bundle workspace libraries per app.', 'Version the route contract, not the implementation.'] },
      { kind: 'callout', tone: 'info', text: 'Remote assets live under /mfe/<name>/ so they never collide with page routes such as /blog/<slug>.' },
    ],
  },
  {
    slug: 'angular-signals-in-practice',
    title: 'Angular Signals in Practice',
    excerpt:
      'Modelling local state, derived values and side effects with signal, computed and effect — and knowing when RxJS is still the better tool.',
    category: 'angular',
    tags: ['angular', 'signals', 'rxjs'],
    publishedAt: '2026-09-15',
    readingMinutes: 7,
    author: AUTHOR,
    featured: true,
    body: [
      { kind: 'paragraph', text: 'Signals give Angular a synchronous, fine-grained reactivity primitive. They shine for component state and derived values, while RxJS remains the right tool for event streams, cancellation and time.' },
      { kind: 'heading', level: 2, text: 'Derive, do not duplicate' },
      { kind: 'code', language: 'ts', code: "const query = signal('');\nconst results = computed(() => articles().filter((a) => a.title.includes(query())));" },
      { kind: 'paragraph', text: 'If a value can be computed from other state, make it a computed signal. It is memoised, lazy and impossible to forget to update.' },
      { kind: 'heading', level: 2, text: 'Effects are for the outside world' },
      { kind: 'paragraph', text: 'Use effect() to synchronise with things Angular does not own: localStorage, document attributes, analytics. Avoid writing to other signals from effects; that is usually a computed in disguise.' },
    ],
  },
  {
    slug: 'designing-a-bff-with-nestjs',
    title: 'Designing a Backend-for-Frontend with NestJS',
    excerpt:
      'Where a BFF earns its keep: aggregation, response shaping and auth boundaries between the browser and internal services.',
    category: 'backend',
    tags: ['nestjs', 'bff', 'api-design'],
    publishedAt: '2026-08-30',
    readingMinutes: 8,
    author: AUTHOR,
    featured: true,
    body: [
      { kind: 'paragraph', text: 'A Backend-for-Frontend sits between the browser and internal services. It speaks the UI’s language, aggregates calls and keeps tokens and internal topology out of the client.' },
      { kind: 'heading', level: 2, text: 'Responsibilities' },
      { kind: 'list', items: ['Aggregate multiple service calls into one view model.', 'Shape responses for the screens that consume them.', 'Terminate browser sessions and forward service credentials.'] },
      { kind: 'heading', level: 2, text: 'What it should not do' },
      { kind: 'paragraph', text: 'Business rules belong in domain services. A BFF that grows its own persistence layer becomes a second monolith.' },
    ],
  },
  {
    slug: 'docker-multi-stage-builds-for-angular',
    title: 'Multi-stage Docker Builds for Angular Apps',
    excerpt: 'Small, non-root Nginx images for each micro frontend, built reproducibly from the monorepo root.',
    category: 'devops',
    tags: ['docker', 'nginx', 'ci'],
    publishedAt: '2026-08-12',
    readingMinutes: 6,
    author: AUTHOR,
    body: [
      { kind: 'paragraph', text: 'The build stage installs dependencies with npm ci and runs a single Nx build target. The runtime stage copies only static assets into an unprivileged Nginx image.' },
      { kind: 'code', language: 'dockerfile', code: 'FROM node:24-alpine AS build\nRUN npm ci\nRUN npx nx build blog-mfe\n\nFROM nginxinc/nginx-unprivileged:alpine\nCOPY --from=build /workspace/dist/apps/blog-mfe/browser /usr/share/nginx/html' },
      { kind: 'callout', tone: 'warning', text: 'Never bake environment-specific URLs or secrets into the image; inject them at container start.' },
    ],
  },
  {
    slug: 'postgres-indexing-basics',
    title: 'PostgreSQL Indexing Basics',
    excerpt: 'B-tree, partial and expression indexes — and how to read EXPLAIN before adding any of them.',
    category: 'databases',
    tags: ['postgresql', 'performance'],
    publishedAt: '2026-07-21',
    readingMinutes: 10,
    author: AUTHOR,
    body: [
      { kind: 'paragraph', text: 'Indexes are a trade-off: faster reads for slower writes and more storage. Measure first with EXPLAIN (ANALYZE, BUFFERS).' },
      { kind: 'code', language: 'sql', code: "CREATE INDEX CONCURRENTLY idx_articles_published\n  ON articles (published_at DESC)\n  WHERE status = 'published';" },
      { kind: 'paragraph', text: 'Partial indexes keep the index small when queries always filter on the same predicate.' },
    ],
  },
  {
    slug: 'nx-affected-in-ci',
    title: 'Fast CI with nx affected',
    excerpt: 'Only lint, test and build what a change can actually break — using the project graph Nx already knows.',
    category: 'tooling',
    tags: ['nx', 'ci', 'github-actions'],
    publishedAt: '2026-07-02',
    readingMinutes: 5,
    author: AUTHOR,
    body: [
      { kind: 'paragraph', text: 'nx affected compares the current commit with a base and runs targets only for projects touched by the diff, plus everything that depends on them.' },
      { kind: 'code', language: 'bash', code: 'npx nx affected -t lint test build --base=origin/main --head=HEAD' },
      { kind: 'list', ordered: true, items: ['Fetch enough git history for the base commit.', 'Set NX_BASE and NX_HEAD.', 'Cache results locally or remotely.'] },
    ],
  },
];
