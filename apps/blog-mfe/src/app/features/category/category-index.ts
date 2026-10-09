import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { Card, PageHeader } from '@tg-labs/shared-ui';
import { ArticleStore } from '../../data-access/article-store';

@Component({
  selector: 'tg-category-index',
  imports: [RouterLink, Card, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header eyebrow="Blog" heading="Categories" description="Every article belongs to exactly one category." />
    <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      @for (category of categories; track category.slug) {
        <li class="flex">
          <tg-card [interactive]="true" class="w-full">
            <a [routerLink]="link(category.slug)" class="font-semibold text-zinc-950 after:absolute after:inset-0 after:content-[''] dark:text-white">{{ category.name }}</a>
            <p class="mt-1 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{{ category.description }}</p>
            <p class="mt-4 font-mono text-xs text-zinc-500">{{ category.count }} {{ category.count === 1 ? 'article' : 'articles' }}</p>
          </tg-card>
        </li>
      }
    </ul>
  `,
})
export class CategoryIndex {
  protected readonly categories = inject(ArticleStore).categories();
  protected link(slug: string): string {
    return remoteLink('blog', 'category', slug);
  }
}
