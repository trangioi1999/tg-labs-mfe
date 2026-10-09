import type { Route } from '@angular/router';
import { REMOTES } from '@tg-labs/shared-config';
import { routes } from './docs.routes';

/**
 * Routes used only when this remote runs standalone (`nx serve docs-mfe`).
 * The remote is mounted under the same base path as in the Shell, so deep
 * links and absolute router links behave identically in both modes.
 */
export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: REMOTES.docs.basePath },
  { path: REMOTES.docs.basePath, children: routes },
  { path: '**', redirectTo: REMOTES.docs.basePath },
];
