import type { ArticleSummary } from '@tg-labs/shared-models';

/**
 * Mock homepage content. Slugs match the Blog remote's mock articles.
 * Will be replaced by a BFF call (`GET /api/articles?featured=true`).
 */
export const FEATURED_ARTICLES: readonly ArticleSummary[] = [
  {
    slug: 'micro-frontends-with-native-federation',
    title: 'Micro Frontends with Angular Native Federation',
    excerpt:
      'How a dynamic host, a runtime manifest and route-level contracts keep independently deployed Angular apps feeling like one product.',
    category: 'frontend-architecture',
    tags: ['angular', 'native-federation', 'architecture'],
    publishedAt: '2026-09-28',
    readingMinutes: 9,
    author: { name: 'TG Labs' },
    featured: true,
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
    author: { name: 'TG Labs' },
    featured: true,
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
    author: { name: 'TG Labs' },
    featured: true,
  },
];

export interface Topic {
  slug: string;
  name: string;
  summary: string;
}

export const TOPICS: readonly Topic[] = [
  {
    slug: 'frontend-architecture',
    name: 'Frontend Architecture',
    summary: 'Micro frontends, monorepos and module boundaries.',
  },
  {
    slug: 'angular',
    name: 'Angular',
    summary: 'Signals, standalone APIs, routing and performance.',
  },
  {
    slug: 'backend',
    name: 'Backend & APIs',
    summary: 'BFFs, gateways and Spring Boot services.',
  },
  {
    slug: 'devops',
    name: 'DevOps & Infrastructure',
    summary: 'Docker, Nginx, CI/CD and VPS operations.',
  },
  {
    slug: 'databases',
    name: 'Databases',
    summary: 'PostgreSQL modelling, indexing and migrations.',
  },
  {
    slug: 'tooling',
    name: 'Tooling',
    summary: 'Nx, build pipelines and developer experience.',
  },
];

export interface Resource {
  title: string;
  description: string;
  path: string;
  kind: string;
}

export const RESOURCES: readonly Resource[] = [
  {
    title: 'JSON Formatter',
    description: 'Validate, pretty-print and minify JSON in the browser.',
    path: '/tools/json-formatter',
    kind: 'tool',
  },
  {
    title: 'Base64 Encoder',
    description: 'Encode and decode UTF-8 text to and from Base64.',
    path: '/tools/base64',
    kind: 'tool',
  },
  {
    title: 'JWT Decoder',
    description:
      'Inspect a token’s header and claims. Decode only — no verification.',
    path: '/tools/jwt-decoder',
    kind: 'tool',
  },
  {
    title: 'Engineering Docs',
    description: 'Guides on architecture, local setup and deployment.',
    path: '/docs',
    kind: 'docs',
  },
  {
    title: 'Signals Lab',
    description: 'An interactive look at signal, computed and effect.',
    path: '/playground/signals-lab',
    kind: 'demo',
  },
];
