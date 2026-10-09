import { initFederation } from '@angular-architects/native-federation';
import type { RemoteModuleLoader } from './app/core/federation/remote-module-loader';

/**
 * The Shell is a *dynamic host*: remote entry URLs are read at runtime from
 * `federation.manifest.json`, so every environment (local dev, Docker, VPS)
 * can point to different remote URLs without rebuilding the Shell.
 *
 * A remote that cannot be reached is skipped by the orchestrator (non-strict
 * mode), so the Shell always boots; the affected section renders a fallback
 * page instead.
 */
initFederation('federation.manifest.json', {
  hostRemoteEntry: { url: './remoteEntry.json' },
})
  .then(
    (federation): RemoteModuleLoader => federation.loadRemoteModule,
    (error: unknown): RemoteModuleLoader => {
      console.error('[shell] Native Federation failed to initialise', error);
      return () => Promise.reject(new Error('Native Federation is not initialised'));
    },
  )
  .then((loader) => import('./bootstrap').then((m) => m.bootstrap(loader)))
  .catch((error: unknown) => console.error(error));
