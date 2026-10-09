import { Injectable, InjectionToken, inject } from '@angular/core';
import { REMOTE_LIST, type RemoteDefinition } from '@tg-labs/shared-config';
import type { NavItem } from '@tg-labs/shared-models';

/**
 * Runtime manifest: federation name -> remoteEntry.json URL.
 *
 * It doubles as the list of ENABLED sections: a remote that is missing from
 * the manifest is hidden everywhere in the Shell (navigation, home page,
 * routes). Deployments control it with the ENABLED_REMOTES variable.
 */
export type RemoteManifest = Readonly<Record<string, string>>;

/** The subset of the Native Federation runtime the Shell relies on. */
export interface FederationRuntime {
  initRemoteEntry(remoteEntryUrl: string, remoteName: string): Promise<unknown>;
  loadRemoteModule<T = unknown>(
    remoteName: string,
    exposedModule: string,
  ): Promise<T>;
}

export const REMOTE_MANIFEST = new InjectionToken<RemoteManifest>(
  'REMOTE_MANIFEST',
);
export const FEDERATION_RUNTIME = new InjectionToken<FederationRuntime>(
  'FEDERATION_RUNTIME',
);

export interface RemoteNavItem extends NavItem {
  remote: string;
}

/**
 * Knows which remotes are enabled and initialises each one lazily: a
 * remote's remoteEntry.json is fetched the first time it is needed
 * (navigation or hover prefetch), never at Shell start-up.
 */
@Injectable({ providedIn: 'root' })
export class RemoteRegistry {
  private readonly manifest = inject(REMOTE_MANIFEST);
  private readonly runtime = inject(FEDERATION_RUNTIME);
  private readonly initialised = new Map<string, Promise<void>>();

  /** Enabled remotes, in the order defined by the route contract. */
  readonly enabled: readonly RemoteDefinition[] = REMOTE_LIST.filter(
    (remote) => this.urlOf(remote.name) !== undefined,
  );

  readonly nav: readonly RemoteNavItem[] = this.enabled.map((remote) => ({
    label: remote.label,
    path: `/${remote.basePath}`,
    description: remote.description,
    remote: remote.name,
  }));

  isEnabled(remoteName: string): boolean {
    return this.enabled.some((remote) => remote.name === remoteName);
  }

  /**
   * False only for links into a disabled remote section; Shell pages such as
   * `/` or `/about` are always available.
   */
  isPathEnabled(path: string): boolean {
    const segment = path.split('/').filter(Boolean)[0];
    const remote = REMOTE_LIST.find((r) => r.basePath === segment);
    return !remote || this.isEnabled(remote.name);
  }

  /** Starts fetching a remote's remoteEntry.json without waiting for it. */
  prefetch(remoteName: string): void {
    this.ensureInitialised(remoteName).catch(() => undefined);
  }

  async loadModule<T = unknown>(
    remoteName: string,
    exposedModule: string,
  ): Promise<T> {
    await this.ensureInitialised(remoteName);
    return this.runtime.loadRemoteModule<T>(remoteName, exposedModule);
  }

  private ensureInitialised(remoteName: string): Promise<void> {
    const url = this.urlOf(remoteName);
    if (url === undefined) {
      return Promise.reject(
        new Error(`Remote "${remoteName}" is not enabled in the manifest`),
      );
    }
    let pending = this.initialised.get(remoteName);
    if (!pending) {
      pending = this.runtime.initRemoteEntry(url, remoteName).then(
        () => undefined,
        (error: unknown) => {
          // Allow a later attempt (e.g. after the remote comes back).
          this.initialised.delete(remoteName);
          throw error;
        },
      );
      this.initialised.set(remoteName, pending);
    }
    return pending;
  }

  private urlOf(remoteName: string): string | undefined {
    const url = this.manifest[remoteName];
    return typeof url === 'string' && url.trim() ? url : undefined;
  }
}

/** `canMatch` guard: a disabled remote's URLs fall through to the 404 page. */
export function remoteEnabled(remote: RemoteDefinition): () => boolean {
  return () => inject(RemoteRegistry).isEnabled(remote.name);
}
