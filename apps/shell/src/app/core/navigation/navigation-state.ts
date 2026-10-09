import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { REMOTE_LIST } from '@tg-labs/shared-config';

/**
 * Basic, Shell-only navigation state: whether a navigation is running, which
 * remote section is being fetched, and whether the mobile menu is open.
 * This state is intentionally NOT shared with the Remotes.
 */
@Injectable({ providedIn: 'root' })
export class NavigationState {
  private readonly router = inject(Router);

  readonly navigating = signal(false);
  /** Label of the remote section currently being downloaded, if any. */
  readonly loadingSection = signal<string | null>(null);
  readonly mobileMenuOpen = signal(false);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.navigating.set(true);
        this.mobileMenuOpen.set(false);
      } else if (event instanceof RouteConfigLoadStart) {
        const remote = REMOTE_LIST.find((r) => r.basePath === event.route.path);
        if (remote) {
          this.loadingSection.set(remote.label);
        }
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.navigating.set(false);
        this.loadingSection.set(null);
      }
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
