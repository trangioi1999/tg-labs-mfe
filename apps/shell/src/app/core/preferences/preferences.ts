import {
  DOCUMENT,
  DestroyRef,
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontScale = 'sm' | 'md' | 'lg';
export type HomeBlock = 'explore' | 'featured' | 'topics' | 'resources';

export const ACCENTS = [
  { id: 'teal', label: 'Teal', swatch: 'oklch(0.6 0.118 184.704)' },
  { id: 'emerald', label: 'Emerald', swatch: 'oklch(59.6% 0.145 163.225)' },
  { id: 'sky', label: 'Sky', swatch: 'oklch(58.8% 0.158 241.966)' },
  { id: 'blue', label: 'Blue', swatch: 'oklch(54.6% 0.245 262.881)' },
  { id: 'indigo', label: 'Indigo', swatch: 'oklch(51.1% 0.262 276.966)' },
  { id: 'violet', label: 'Violet', swatch: 'oklch(54.1% 0.281 293.009)' },
  { id: 'rose', label: 'Rose', swatch: 'oklch(58.6% 0.253 17.585)' },
  { id: 'orange', label: 'Orange', swatch: 'oklch(64.6% 0.222 41.116)' },
  { id: 'amber', label: 'Amber', swatch: 'oklch(66.6% 0.179 58.318)' },
] as const;

export type Accent = (typeof ACCENTS)[number]['id'];

export const HOME_BLOCKS: readonly {
  id: HomeBlock;
  label: string;
  description: string;
}[] = [
  {
    id: 'explore',
    label: 'Explore the lab',
    description: 'Cards linking to every visible section.',
  },
  {
    id: 'featured',
    label: 'Featured articles',
    description: 'Three hand-picked posts from the Blog.',
  },
  {
    id: 'topics',
    label: 'Browse by topic',
    description: 'Blog categories grid.',
  },
  {
    id: 'resources',
    label: 'Developer resources',
    description: 'Shortcuts to tools, docs and demos.',
  },
];

export interface Preferences {
  theme: ThemeMode;
  accent: Accent;
  fontScale: FontScale;
  /** Remote names the visitor chose to hide from navigation and home. */
  hiddenSections: string[];
  hiddenBlocks: HomeBlock[];
}

/** localStorage key; must match the inline script in `index.html`. */
export const PREFERENCES_STORAGE_KEY = 'tg-preferences';
/** Pre-preferences key that only stored the theme; read once for migration. */
const LEGACY_THEME_KEY = 'tg-theme';

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'system',
  accent: 'teal',
  fontScale: 'md',
  hiddenSections: [],
  hiddenBlocks: [],
};

/**
 * Visitor preferences for the whole site: colour theme, accent colour, text
 * size and which sections/home blocks are shown. Stored in this browser only.
 *
 * Everything is applied as attributes on `<html>` (`.dark`, `data-accent`,
 * `data-font-scale`), so Remotes pick the result up through CSS variables
 * without knowing this service exists. The inline script in `index.html`
 * applies the same attributes before first paint.
 */
@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly media = inject(DOCUMENT).defaultView?.matchMedia?.(
    '(prefers-color-scheme: dark)',
  );
  private readonly systemDark = signal(this.media?.matches ?? false);
  private readonly state = signal<Preferences>(readStored());

  readonly preferences = this.state.asReadonly();
  readonly themeMode = computed(() => this.state().theme);
  /** The theme actually shown, with `system` resolved. */
  readonly theme = computed<'light' | 'dark'>(() => {
    const mode = this.state().theme;
    if (mode === 'system') {
      return this.systemDark() ? 'dark' : 'light';
    }
    return mode;
  });
  readonly isCustomised = computed(
    () => JSON.stringify(this.state()) !== JSON.stringify(DEFAULT_PREFERENCES),
  );

  constructor() {
    const onChange = (event: MediaQueryListEvent) =>
      this.systemDark.set(event.matches);
    this.media?.addEventListener?.('change', onChange);
    inject(DestroyRef).onDestroy(() =>
      this.media?.removeEventListener?.('change', onChange),
    );

    effect(() => {
      const prefs = this.state();
      this.root.classList.toggle('dark', this.theme() === 'dark');
      setData(this.root, 'accent', prefs.accent, DEFAULT_PREFERENCES.accent);
      setData(
        this.root,
        'fontScale',
        prefs.fontScale,
        DEFAULT_PREFERENCES.fontScale,
      );
      persist(prefs);
    });
  }

  /** Quick toggle used by the header: flips the visible theme. */
  toggleTheme(): void {
    this.update({ theme: this.theme() === 'dark' ? 'light' : 'dark' });
  }

  update(patch: Partial<Preferences>): void {
    this.state.update((prefs) => ({ ...prefs, ...patch }));
  }

  isSectionVisible(remoteName: string): boolean {
    return !this.state().hiddenSections.includes(remoteName);
  }

  setSectionVisible(remoteName: string, visible: boolean): void {
    this.update({
      hiddenSections: toggleIn(
        this.state().hiddenSections,
        remoteName,
        visible,
      ),
    });
  }

  isBlockVisible(block: HomeBlock): boolean {
    return !this.state().hiddenBlocks.includes(block);
  }

  setBlockVisible(block: HomeBlock, visible: boolean): void {
    this.update({
      hiddenBlocks: toggleIn(this.state().hiddenBlocks, block, visible),
    });
  }

  reset(): void {
    this.state.set({ ...DEFAULT_PREFERENCES });
  }
}

function toggleIn<T>(list: readonly T[], item: T, visible: boolean): T[] {
  const rest = list.filter((entry) => entry !== item);
  return visible ? rest : [...rest, item];
}

function setData(
  el: HTMLElement,
  key: 'accent' | 'fontScale',
  value: string,
  fallback: string,
): void {
  if (value === fallback) {
    delete el.dataset[key];
  } else {
    el.dataset[key] = value;
  }
}

function readStored(): Preferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (raw) {
      return sanitize(JSON.parse(raw));
    }
    const legacy = localStorage.getItem(LEGACY_THEME_KEY);
    if (legacy === 'light' || legacy === 'dark') {
      return { ...DEFAULT_PREFERENCES, theme: legacy };
    }
  } catch {
    // Unavailable storage or corrupt JSON: fall back to defaults.
  }
  return { ...DEFAULT_PREFERENCES };
}

function persist(prefs: Preferences): void {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
    localStorage.removeItem(LEGACY_THEME_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the
    // preferences still apply for the current page view.
  }
}

/** Accepts only known values so a hand-edited entry cannot break the page. */
export function sanitize(value: unknown): Preferences {
  const input = (value ?? {}) as Partial<Record<keyof Preferences, unknown>>;
  const pick = <T extends string>(
    candidate: unknown,
    allowed: readonly T[],
    fallback: T,
  ): T => (allowed.includes(candidate as T) ? (candidate as T) : fallback);
  const strings = (candidate: unknown): string[] =>
    Array.isArray(candidate)
      ? candidate.filter((item): item is string => typeof item === 'string')
      : [];

  return {
    theme: pick(input.theme, ['light', 'dark', 'system'], 'system'),
    accent: pick(
      input.accent,
      ACCENTS.map((accent) => accent.id),
      DEFAULT_PREFERENCES.accent,
    ),
    fontScale: pick(input.fontScale, ['sm', 'md', 'lg'], 'md'),
    hiddenSections: strings(input.hiddenSections),
    hiddenBlocks: strings(input.hiddenBlocks).filter((block) =>
      HOME_BLOCKS.some((known) => known.id === block),
    ) as HomeBlock[],
  };
}
