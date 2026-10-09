import type { Route } from '@angular/router';
import { REMOTES } from '@tg-labs/shared-config';
import { loadRemoteRoutes } from './core/federation/load-remote-routes';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';

/**
 * Top-level routes. The Shell owns `/`, `/about` and the global 404; each
 * remote owns everything below its base path (`/blog/**`, `/docs/**`, ...).
 */
export const appRoutes: Route[] = [
  { path: '', component: Home, pathMatch: 'full' },
  {
    path: 'about',
    title: 'About',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  { path: REMOTES.blog.basePath, loadChildren: loadRemoteRoutes(REMOTES.blog) },
  { path: REMOTES.docs.basePath, loadChildren: loadRemoteRoutes(REMOTES.docs) },
  {
    path: REMOTES.tools.basePath,
    loadChildren: loadRemoteRoutes(REMOTES.tools),
  },
  {
    path: REMOTES.playground.basePath,
    loadChildren: loadRemoteRoutes(REMOTES.playground),
  },
  { path: '**', component: NotFound, title: 'Page not found' },
];
