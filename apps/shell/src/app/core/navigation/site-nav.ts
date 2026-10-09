import { Injectable, computed, inject } from '@angular/core';
import {
  RemoteRegistry,
  type RemoteNavItem,
} from '../federation/remote-registry';
import { PreferencesService } from '../preferences/preferences';

/**
 * The sections a visitor actually sees: remotes enabled in the deployment
 * manifest, minus the ones hidden in Settings. Hidden sections are only
 * removed from navigation and the home page; their URLs keep working.
 */
@Injectable({ providedIn: 'root' })
export class SiteNav {
  private readonly registry = inject(RemoteRegistry);
  private readonly prefs = inject(PreferencesService);

  readonly sections = computed<readonly RemoteNavItem[]>(() => {
    const hidden = this.prefs.preferences().hiddenSections;
    return this.registry.nav.filter((item) => !hidden.includes(item.remote));
  });

  isVisible(remoteName: string): boolean {
    return (
      this.registry.isEnabled(remoteName) &&
      this.prefs.isSectionVisible(remoteName)
    );
  }

  /** Like {@link RemoteRegistry.isPathEnabled}, but also honours hiding. */
  isPathVisible(path: string): boolean {
    const remote = this.registry.remoteForPath(path);
    return !remote || this.isVisible(remote.name);
  }

  prefetch(remoteName: string): void {
    this.registry.prefetch(remoteName);
  }
}
