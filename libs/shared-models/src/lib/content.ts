/**
 * Content contracts shared between the frontend applications and (later) the
 * BFF / Content Service. Keep these as plain, serialisable shapes so they can
 * double as API DTOs.
 */

/** ISO-8601 calendar date, e.g. `2026-09-14`. */
export type IsoDate = string;

export interface Author {
  name: string;
  handle?: string;
}

/**
 * A minimal, framework-agnostic rich-text model. It deliberately mirrors the
 * subset of Markdown we need today, so a Markdown parser can later produce the
 * same structure without changing any renderer.
 */
export type ContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'heading'; text: string; level: 2 | 3 }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'code'; code: string; language?: string }
  | { kind: 'callout'; text: string; tone?: 'info' | 'warning' };

export interface ArticleSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: IsoDate;
  readingMinutes: number;
  author: Author;
  featured?: boolean;
}

export interface Article extends ArticleSummary {
  body: ContentBlock[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
}

export interface DocPageSummary {
  slug: string;
  title: string;
  summary: string;
  section: string;
}

export interface DocPage extends DocPageSummary {
  body: ContentBlock[];
  updatedAt: IsoDate;
}

export interface DocSection {
  slug: string;
  title: string;
  pages: DocPageSummary[];
}
