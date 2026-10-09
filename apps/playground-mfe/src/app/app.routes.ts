import type { Route } from '@angular/router';
import { REMOTES } from '@tg-labs/shared-config';
import { routes } from './playground.routes';

/**
 * Routes used only when this remote runs standalone (`nx serve playground-mfe`).
 * The remote is mounted under the same base path as in the Shell, so deep
 * links and absolute router links behave identically in both modes.
 */
export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: REMOTES.playground.basePath },
  { path: REMOTES.playground.basePath, children: routes },
  { path: '**', redirectTo: REMOTES.playground.basePath },
];
