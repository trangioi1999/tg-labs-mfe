import { initFederation } from '@angular-architects/native-federation';

/**
 * Standalone entry point for local development. When the Shell loads this
 * remote it imports the exposed `./routes` module directly and this file is
 * never executed.
 */
initFederation({}, { hostRemoteEntry: { url: './remoteEntry.json' } })
  .then(() => import('./bootstrap'))
  .catch((error: unknown) => console.error(error));
