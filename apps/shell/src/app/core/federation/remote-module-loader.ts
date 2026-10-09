import { InjectionToken } from '@angular/core';

/** Signature of the `loadRemoteModule` function returned by `initFederation`. */
export type RemoteModuleLoader = <TModule = unknown>(
  remoteName: string,
  exposedModule: string,
) => Promise<TModule>;

export const REMOTE_MODULE_LOADER = new InjectionToken<RemoteModuleLoader>(
  'REMOTE_MODULE_LOADER',
);
