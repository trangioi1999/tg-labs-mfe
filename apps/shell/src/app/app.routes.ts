import type { Route } from '@angular/router';
import { REMOTE_LIST } from '@tg-labs/shared-config';
import { loadRemoteRoutes } from './core/federation/load-remote-routes';
import { remoteEnabled } from './core/federation/remote-registry';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';

/**
 * Top-level routes. The Shell owns `/`, `/about` and the global 404; each
 * remote owns everything below its base path (`/blog/**`, `/docs/**`, ...).
 * Remotes disabled in the runtime manifest do not match, so their URLs fall
 * through to the 404 page.
 */
export const appRoutes: Route[] = [
  { path: '', component: Home, pathMatch: 'full' },
  {
    path: 'about',
    title: 'About',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  ...REMOTE_LIST.map(
    (remote): Route => ({
      path: remote.basePath,
      canMatch: [remoteEnabled(remote)],
      loadChildren: loadRemoteRoutes(remote),
    }),
  ),
  { path: '**', component: NotFound, title: 'Page not found' },
];
