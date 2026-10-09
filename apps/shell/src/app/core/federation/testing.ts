import type { Provider } from '@angular/core';
import {
  FEDERATION_RUNTIME,
  type FederationRuntime,
  REMOTE_MANIFEST,
  type RemoteManifest,
} from './remote-registry';

export const ALL_REMOTES_MANIFEST: RemoteManifest = {
  'blog-mfe': '/mfe/blog/remoteEntry.json',
  'docs-mfe': '/mfe/docs/remoteEntry.json',
  'tools-mfe': '/mfe/tools/remoteEntry.json',
  'playground-mfe': '/mfe/playground/remoteEntry.json',
};

/** Test providers for the federation runtime; nothing is fetched. */
export function provideFakeFederation(
  manifest: RemoteManifest = ALL_REMOTES_MANIFEST,
  runtime: Partial<FederationRuntime> = {},
): Provider[] {
  const fake: FederationRuntime = {
    initRemoteEntry: () => Promise.resolve(),
    loadRemoteModule: () => Promise.reject(new Error('not stubbed')),
    ...runtime,
  };
  return [
    { provide: REMOTE_MANIFEST, useValue: manifest },
    { provide: FEDERATION_RUNTIME, useValue: fake },
  ];
}
