import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

/** localStorage key; must match the inline script in `index.html`. */
export const THEME_STORAGE_KEY = 'tg-theme';

/**
 * Owns the site-wide colour theme. The initial theme is applied before
 * Angular boots by an inline script in `index.html` (no flash of the wrong
 * theme); this service reads that state and handles explicit user toggles.
 * Remotes only consume the resulting `.dark` class through Tailwind's
 * `dark:` variant and never mutate it.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly current = signal<Theme>(
    this.root.classList.contains('dark') ? 'dark' : 'light',
  );

  readonly theme = this.current.asReadonly();

  toggle(): void {
    this.set(this.current() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.current.set(theme);
    this.root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies); the
      // theme still applies for the current page view.
    }
  }
}
