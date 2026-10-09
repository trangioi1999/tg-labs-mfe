import type { DocPage } from '@tg-labs/shared-models';

export interface SectionMeta {
  slug: string;
  title: string;
}

/** Section order for the navigation sidebar. */
export const SECTIONS: readonly SectionMeta[] = [
  { slug: 'getting-started', title: 'Getting started' },
  { slug: 'architecture', title: 'Architecture' },
  { slug: 'operations', title: 'Operations' },
];

/**
 * Mock documentation pages. `body` uses the shared ContentBlock model so a
 * Markdown/MDX pipeline can later produce the same structure.
 */
export const DOC_PAGES: readonly DocPage[] = [
  {
    slug: 'introduction',
    section: 'getting-started',
    title: 'Introduction',
    summary: 'What TG Labs is, and how the repository is organised.',
    updatedAt: '2026-10-01',
    body: [
      {
        kind: 'paragraph',
        text: 'TG Labs is an Nx monorepo containing one Angular Shell and four Angular Remotes connected with Native Federation, plus shared libraries and infrastructure configuration.',
      },
      {
        kind: 'list',
        items: [
          'apps/ — Shell and Remotes',
          'libs/ — shared UI, layout, models, utils and config',
          'docker/, infra/, compose/ — container and gateway setup',
        ],
      },
    ],
  },
  {
    slug: 'local-development',
    section: 'getting-started',
    title: 'Local development',
    summary: 'Run the Shell and every Remote on your machine.',
    updatedAt: '2026-10-01',
    body: [
      {
        kind: 'paragraph',
        text: 'Each application has its own dev server. The Shell reads remote URLs from public/federation.manifest.json, which points at localhost ports 4201–4204 by default.',
      },
      {
        kind: 'code',
        language: 'bash',
        code: 'npm ci\nnpx nx run-many -t serve -p shell blog-mfe docs-mfe tools-mfe playground-mfe',
      },
      {
        kind: 'callout',
        tone: 'info',
        text: 'You can run a single remote on its own, e.g. npx nx serve tools-mfe, and open http://localhost:4203.',
      },
    ],
  },
  {
    slug: 'micro-frontends',
    section: 'architecture',
    title: 'Micro frontend architecture',
    summary: 'Host, remotes and the responsibilities of each.',
    updatedAt: '2026-09-28',
    body: [
      {
        kind: 'paragraph',
        text: 'The Shell owns the global layout, navigation, the home page and error states. Each Remote owns one product area and exposes its routes through Native Federation.',
      },
      { kind: 'heading', level: 2, text: 'Sharing' },
      {
        kind: 'paragraph',
        text: 'Angular and RxJS are shared as strict-version singletons. Workspace libraries are bundled into each app so remotes can be deployed independently.',
      },
    ],
  },
  {
    slug: 'routing-contract',
    section: 'architecture',
    title: 'Routing contract',
    summary: 'How the Shell mounts remote route tables.',
    updatedAt: '2026-09-28',
    body: [
      {
        kind: 'paragraph',
        text: 'Every remote exposes ./routes with a named export routes. The Shell maps /blog, /docs, /tools and /playground to those route tables with loadChildren.',
      },
      {
        kind: 'code',
        language: 'ts',
        code: "{ path: 'blog', loadChildren: loadRemoteRoutes(REMOTES.blog) }",
      },
      {
        kind: 'callout',
        tone: 'warning',
        text: 'If a remote cannot be loaded, the Shell renders a fallback page for that section instead of failing navigation.',
      },
    ],
  },
  {
    slug: 'docker-and-nginx',
    section: 'operations',
    title: 'Docker and Nginx',
    summary: 'One image per application behind a single gateway.',
    updatedAt: '2026-10-02',
    body: [
      {
        kind: 'paragraph',
        text: 'Each application builds into its own unprivileged Nginx image. A gateway Nginx routes page requests to the Shell, /mfe/<name>/ to each remote and /api/ to the BFF.',
      },
    ],
  },
  {
    slug: 'ci-pipeline',
    section: 'operations',
    title: 'CI pipeline',
    summary: 'Lint, test and build only what changed.',
    updatedAt: '2026-10-02',
    body: [
      {
        kind: 'paragraph',
        text: 'GitHub Actions installs dependencies with npm ci and runs nx affected for lint, test and build.',
      },
      {
        kind: 'code',
        language: 'bash',
        code: 'npx nx affected -t lint test build',
      },
    ],
  },
];
