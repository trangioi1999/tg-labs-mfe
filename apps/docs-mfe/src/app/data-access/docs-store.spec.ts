import { TestBed } from '@angular/core/testing';
import { DocsStore } from './docs-store';

describe('DocsStore', () => {
  let store: DocsStore;

  beforeEach(() => {
    store = TestBed.inject(DocsStore);
  });

  it('groups pages into ordered sections', () => {
    const sections = store.sections();
    expect(sections.map((s) => s.slug)).toEqual([
      'getting-started',
      'architecture',
      'operations',
    ]);
    expect(sections[0].pages.map((p) => p.slug)).toEqual([
      'introduction',
      'local-development',
    ]);
  });

  it('returns previous/next pages across sections', () => {
    const { previous, next } = store.neighbours('local-development');
    expect(previous?.slug).toBe('introduction');
    expect(next?.slug).toBe('micro-frontends');
    expect(store.neighbours('introduction').previous).toBeUndefined();
  });

  it('searches titles, summaries and body text', () => {
    expect(store.search('loadChildren').map((p) => p.slug)).toEqual([
      'routing-contract',
    ]);
    expect(store.search('')).toEqual([]);
  });
});
