import { Injectable, inject, signal } from '@angular/core';
import { REMOTE_LIST } from '@tg-labs/shared-config';
import { RemoteRegistry } from '../../../core/federation/remote-registry';

export type HealthStatus = 'disabled' | 'checking' | 'online' | 'offline';

export interface RemoteHealth {
  status: HealthStatus;
  latencyMs?: number;
  exposes?: number;
  shared?: number;
  error?: string;
}

/**
 * Checks each enabled remote by fetching its remoteEntry.json. It only reads
 * metadata; it does not initialise the remote in the federation runtime.
 */
@Injectable({ providedIn: 'root' })
export class RemoteHealthService {
  private readonly registry = inject(RemoteRegistry);
  private readonly state = signal<Readonly<Record<string, RemoteHealth>>>({});

  readonly health = this.state.asReadonly();
  readonly checkedAt = signal<Date | null>(null);

  async checkAll(): Promise<void> {
    await Promise.all(REMOTE_LIST.map((remote) => this.check(remote.name)));
    this.checkedAt.set(new Date());
  }

  async check(remoteName: string): Promise<void> {
    const url = this.registry.entryUrl(remoteName);
    if (!url) {
      this.set(remoteName, { status: 'disabled' });
      return;
    }
    this.set(remoteName, { status: 'checking' });
    const started = performance.now();
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const entry = (await response.json()) as {
        exposes?: unknown[];
        shared?: unknown[];
      };
      this.set(remoteName, {
        status: 'online',
        latencyMs: Math.round(performance.now() - started),
        exposes: entry.exposes?.length ?? 0,
        shared: entry.shared?.length ?? 0,
      });
    } catch (error) {
      this.set(remoteName, {
        status: 'offline',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private set(remoteName: string, health: RemoteHealth): void {
    this.state.update((all) => ({ ...all, [remoteName]: health }));
  }
}
