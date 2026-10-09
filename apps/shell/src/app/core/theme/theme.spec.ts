import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme';

describe('ThemeService', () => {
  afterEach(() => {
    TestBed.inject(DOCUMENT).documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('toggles the dark class on <html> and persists the choice', () => {
    const service = TestBed.inject(ThemeService);
    const root = TestBed.inject(DOCUMENT).documentElement;

    expect(service.theme()).toBe('light');
    service.toggle();

    expect(service.theme()).toBe('dark');
    expect(root.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });
});
