import { Injectable } from '@angular/core';
import type { DocPage, DocSection } from '@tg-labs/shared-models';
import { matchesQuery } from '@tg-labs/shared-utils';
import { DOC_PAGES, SECTIONS } from './docs.data';

export interface DocNeighbours {
  previous?: DocPage;
  next?: DocPage;
}

/** Read-only access to documentation pages (mock data for now). */
@Injectable({ providedIn: 'root' })
export class DocsStore {
  private readonly ordered: readonly DocPage[] = SECTIONS.flatMap((section) =>
    DOC_PAGES.filter((page) => page.section === section.slug),
  );

  sections(): readonly DocSection[] {
    return SECTIONS.map((section) => ({
      ...section,
      pages: this.ordered
        .filter((page) => page.section === section.slug)
        .map(({ slug, title, summary, section: s }) => ({
          slug,
          title,
          summary,
          section: s,
        })),
    }));
  }

  page(slug: string): DocPage | undefined {
    return this.ordered.find((page) => page.slug === slug);
  }

  sectionTitle(slug: string): string {
    return SECTIONS.find((section) => section.slug === slug)?.title ?? slug;
  }

  neighbours(slug: string): DocNeighbours {
    const index = this.ordered.findIndex((page) => page.slug === slug);
    if (index < 0) {
      return {};
    }
    return { previous: this.ordered[index - 1], next: this.ordered[index + 1] };
  }

  search(query: string): readonly DocPage[] {
    if (!query.trim()) {
      return [];
    }
    return this.ordered.filter((page) =>
      matchesQuery(
        [
          page.title,
          page.summary,
          ...page.body.map((b) => ('text' in b ? b.text : '')),
        ].join(' '),
        query,
      ),
    );
  }
}
