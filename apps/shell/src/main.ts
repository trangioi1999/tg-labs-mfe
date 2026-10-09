import { initFederation } from '@angular-architects/native-federation';
import type {
  FederationRuntime,
  RemoteManifest,
} from './app/core/federation/remote-registry';

/**
 * The Shell is a *dynamic host*. Two runtime inputs, no rebuild needed:
 *
 * - `federation.manifest.json` maps each ENABLED remote to its
 *   remoteEntry.json URL. Remotes missing from it are hidden.
 * - Remotes are NOT contacted at start-up: each remoteEntry.json is fetched
 *   the first time its section is visited (or prefetched on hover), so a
 *   slow or broken remote never delays the Shell.
 */
const MANIFEST_URL = 'federation.manifest.json';

async function loadManifest(): Promise<RemoteManifest> {
  try {
    const response = await fetch(MANIFEST_URL, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new Error('manifest must be a JSON object');
    }
    return Object.fromEntries(
      Object.entries(data).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string',
      ),
    );
  } catch (error: unknown) {
    console.error(`[shell] Could not read ${MANIFEST_URL}`, error);
    return {};
  }
}

const unavailableRuntime: FederationRuntime = {
  initRemoteEntry: () =>
    Promise.reject(new Error('Native Federation is not initialised')),
  loadRemoteModule: () =>
    Promise.reject(new Error('Native Federation is not initialised')),
};

const runtime = initFederation(
  {},
  { hostRemoteEntry: { url: './remoteEntry.json' } },
).then(
  (federation): FederationRuntime => ({
    initRemoteEntry: (url, name) => federation.initRemoteEntry(url, name),
    loadRemoteModule: (name, exposed) =>
      federation.loadRemoteModule(name, exposed),
  }),
  (error: unknown): FederationRuntime => {
    console.error('[shell] Native Federation failed to initialise', error);
    return unavailableRuntime;
  },
);

Promise.all([loadManifest(), runtime])
  .then(([manifest, federation]) =>
    import('./bootstrap').then((m) => m.bootstrap(manifest, federation)),
  )
  .catch((error: unknown) => console.error(error));
