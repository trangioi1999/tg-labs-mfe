import type { NavItem } from '@tg-labs/shared-models';

/**
 * Route contract between the Shell (host) and the Remotes.
 *
 * - `name` must equal the `name` in the remote's `federation.config.mjs` and
 *   the key used in the Shell's `federation.manifest.json`.
 * - `basePath` is the top-level Shell route the remote is mounted on. Remotes
 *   use the same path when running standalone so deep links behave the same.
 * - Every remote exposes its route table under `REMOTE_ROUTES_MODULE`, as a
 *   named export `routes`.
 *
 * Remote *URLs* are deliberately NOT part of this contract: they are resolved
 * at runtime from `federation.manifest.json` so they can change per
 * environment without rebuilding any application.
 */
export const REMOTE_ROUTES_MODULE = './routes';

export interface RemoteDefinition {
  name: string;
  basePath: string;
  label: string;
  description: string;
}

export const REMOTES = {
  blog: {
    name: 'blog-mfe',
    basePath: 'blog',
    label: 'Blog',
    description: 'Long-form technical articles, categories and tags.',
  },
  docs: {
    name: 'docs-mfe',
    basePath: 'docs',
    label: 'Docs',
    description: 'Structured engineering guides and reference notes.',
  },
  tools: {
    name: 'tools-mfe',
    basePath: 'tools',
    label: 'Tools',
    description: 'Small, private-by-default developer utilities.',
  },
  playground: {
    name: 'playground-mfe',
    basePath: 'playground',
    label: 'Playground',
    description: 'Interactive demos and technical experiments.',
  },
} as const satisfies Record<string, RemoteDefinition>;

export type RemoteKey = keyof typeof REMOTES;

export const REMOTE_LIST: readonly RemoteDefinition[] = Object.values(REMOTES);

/** Builds an absolute router link inside a remote, e.g. `remoteLink('blog', 'tag', 'nx')`. */
export function remoteLink(remote: RemoteKey, ...segments: string[]): string {
  return ['', REMOTES[remote].basePath, ...segments].join('/');
}

export const PRIMARY_NAV: readonly NavItem[] = REMOTE_LIST.map((remote) => ({
  label: remote.label,
  path: `/${remote.basePath}`,
  description: remote.description,
}));
