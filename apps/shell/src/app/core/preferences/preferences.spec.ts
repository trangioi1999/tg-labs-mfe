import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  PreferencesService,
  sanitize,
} from './preferences';

describe('PreferencesService', () => {
  const root = () => TestBed.inject(DOCUMENT).documentElement;
  const stored = () =>
    JSON.parse(localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? 'null');

  afterEach(() => {
    root().classList.remove('dark');
    delete root().dataset['accent'];
    delete root().dataset['fontScale'];
    localStorage.clear();
  });

  it('toggles the visible theme, applies .dark and persists it', () => {
    const service = TestBed.inject(PreferencesService);
    expect(service.theme()).toBe('light');

    service.toggleTheme();
    TestBed.tick();

    expect(service.theme()).toBe('dark');
    expect(root().classList.contains('dark')).toBe(true);
    expect(stored().theme).toBe('dark');
  });

  it('applies accent and text size as data attributes on <html>', () => {
    const service = TestBed.inject(PreferencesService);

    service.update({ accent: 'violet', fontScale: 'lg' });
    TestBed.tick();
    expect(root().dataset['accent']).toBe('violet');
    expect(root().dataset['fontScale']).toBe('lg');

    service.reset();
    TestBed.tick();
    expect(root().dataset['accent']).toBeUndefined();
    expect(root().dataset['fontScale']).toBeUndefined();
    expect(service.isCustomised()).toBe(false);
  });

  it('hides and shows sections and home blocks', () => {
    const service = TestBed.inject(PreferencesService);

    service.setSectionVisible('blog-mfe', false);
    service.setBlockVisible('topics', false);
    expect(service.isSectionVisible('blog-mfe')).toBe(false);
    expect(service.isBlockVisible('topics')).toBe(false);

    service.setSectionVisible('blog-mfe', true);
    expect(service.isSectionVisible('blog-mfe')).toBe(true);
  });

  it('migrates the legacy tg-theme key', () => {
    localStorage.setItem('tg-theme', 'dark');
    const service = TestBed.inject(PreferencesService);
    expect(service.themeMode()).toBe('dark');
  });
});

describe('sanitize', () => {
  it('drops unknown values', () => {
    expect(
      sanitize({
        theme: 'neon',
        accent: 'plaid',
        fontScale: 'xxl',
        hiddenSections: ['docs-mfe', 3],
        hiddenBlocks: ['topics', 'nope'],
      }),
    ).toEqual({
      ...DEFAULT_PREFERENCES,
      hiddenSections: ['docs-mfe'],
      hiddenBlocks: ['topics'],
    });
  });
});
