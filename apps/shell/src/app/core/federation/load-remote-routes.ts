import { inject } from '@angular/core';
import type { Routes } from '@angular/router';
import { REMOTE_ROUTES_MODULE, type RemoteDefinition } from '@tg-labs/shared-config';
import { RemoteUnavailable } from '../../pages/remote-unavailable/remote-unavailable';
import { REMOTE_MODULE_LOADER } from './remote-module-loader';

/** Shape every remote exposes under `REMOTE_ROUTES_MODULE`. */
export interface RemoteRoutesModule {
  routes: Routes;
}

/** Upper bound for fetching a remote before showing the fallback page. */
export const REMOTE_LOAD_TIMEOUT_MS = 15_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out loading ${label}`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function isRoutesModule(value: unknown): value is RemoteRoutesModule {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as Partial<RemoteRoutesModule>).routes)
  );
}

/**
 * Creates a `loadChildren` callback that resolves a remote's route table via
 * Native Federation. On failure (remote offline, bad deploy, timeout) it
 * resolves to a catch-all fallback route so the Shell layout stays intact and
 * the user gets an actionable error page instead of a broken navigation.
 */
export function loadRemoteRoutes(
  remote: RemoteDefinition,
  timeoutMs = REMOTE_LOAD_TIMEOUT_MS,
): () => Promise<Routes> {
  return async () => {
    const loadRemoteModule = inject(REMOTE_MODULE_LOADER);
    try {
      const module = await withTimeout(
        loadRemoteModule<unknown>(remote.name, REMOTE_ROUTES_MODULE),
        timeoutMs,
        remote.name,
      );
      if (!isRoutesModule(module)) {
        throw new Error(
          `Remote "${remote.name}" does not export "routes" from ${REMOTE_ROUTES_MODULE}`,
        );
      }
      return module.routes;
    } catch (error: unknown) {
      console.error(`[shell] Could not load remote "${remote.name}"`, error);
      return [
        {
          path: '**',
          component: RemoteUnavailable,
          title: `${remote.label} unavailable`,
          data: { remote },
        },
      ];
    }
  };
}
