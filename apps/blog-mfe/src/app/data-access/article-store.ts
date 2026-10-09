import { Injectable } from '@angular/core';
import type { Article, ArticleSummary, Category } from '@tg-labs/shared-models';
import { matchesQuery } from '@tg-labs/shared-utils';
import { ARTICLES, CATEGORIES } from './articles.data';

export interface CategoryWithCount extends Category {
  count: number;
}

export interface TagWithCount {
  tag: string;
  count: number;
}

const byNewest = (a: ArticleSummary, b: ArticleSummary) =>
  b.publishedAt.localeCompare(a.publishedAt);

/**
 * Read-only access to Blog content. Backed by local mock data today; the
 * public methods are the seam where an HTTP client (BFF) will plug in.
 */
@Injectable({ providedIn: 'root' })
export class ArticleStore {
  private readonly articles = [...ARTICLES].sort(byNewest);

  all(): readonly Article[] {
    return this.articles;
  }

  bySlug(slug: string): Article | undefined {
    return this.articles.find((a) => a.slug === slug);
  }

  category(slug: string): Category | undefined {
    return CATEGORIES.find((c) => c.slug === slug);
  }

  byCategory(slug: string): readonly Article[] {
    return this.articles.filter((a) => a.category === slug);
  }

  byTag(tag: string): readonly Article[] {
    return this.articles.filter((a) => a.tags.includes(tag));
  }

  categories(): readonly CategoryWithCount[] {
    return CATEGORIES.map((c) => ({
      ...c,
      count: this.byCategory(c.slug).length,
    }));
  }

  tags(): readonly TagWithCount[] {
    const counts = new Map<string, number>();
    for (const article of this.articles) {
      for (const tag of article.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }

  search(query: string): readonly Article[] {
    if (!query.trim()) {
      return [];
    }
    return this.articles.filter((a) =>
      matchesQuery(
        [a.title, a.excerpt, a.tags.join(' '), a.category].join(' '),
        query,
      ),
    );
  }
}
