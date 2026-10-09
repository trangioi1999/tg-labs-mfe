import { TestBed } from '@angular/core/testing';
import { ArticleStore } from './article-store';

describe('ArticleStore', () => {
  let store: ArticleStore;

  beforeEach(() => {
    store = TestBed.inject(ArticleStore);
  });

  it('lists articles newest first', () => {
    const dates = store.all().map((a) => a.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('finds an article by slug', () => {
    expect(store.bySlug('angular-signals-in-practice')?.title).toBe('Angular Signals in Practice');
    expect(store.bySlug('missing')).toBeUndefined();
  });

  it('filters by category and tag', () => {
    expect(store.byCategory('devops').map((a) => a.slug)).toEqual([
      'docker-multi-stage-builds-for-angular',
    ]);
    expect(store.byTag('angular').length).toBe(2);
  });

  it('counts articles per category and tag', () => {
    expect(store.categories().every((c) => c.count >= 1)).toBe(true);
    expect(store.tags()[0]).toEqual({ tag: 'angular', count: 2 });
  });

  it('searches titles, excerpts and tags case-insensitively', () => {
    expect(store.search('POSTGRES').map((a) => a.slug)).toEqual(['postgres-indexing-basics']);
    expect(store.search('   ')).toEqual([]);
  });
});
