import type { Route } from '@angular/router';
import { REMOTES } from '@tg-labs/shared-config';
import { routes } from './blog.routes';

/**
 * Routes used only when this remote runs standalone (`nx serve blog-mfe`).
 * The remote is mounted under the same base path as in the Shell, so deep
 * links and absolute router links behave identically in both modes.
 */
export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: REMOTES.blog.basePath },
  { path: REMOTES.blog.basePath, children: routes },
  { path: '**', redirectTo: REMOTES.blog.basePath },
];
