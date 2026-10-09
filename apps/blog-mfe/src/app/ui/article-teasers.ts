import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import type { ArticleSummary } from '@tg-labs/shared-models';
import { Badge } from '@tg-labs/shared-ui';
import { formatDate } from '@tg-labs/shared-utils';

/** Editorial list of article teasers, shared by every Blog listing page. */
@Component({
  selector: 'tg-article-teasers',
  imports: [RouterLink, Badge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="divide-y divide-zinc-200 dark:divide-zinc-800">
      @for (article of articles(); track article.slug) {
        <li>
          <article
            class="group relative grid gap-3 py-8 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8"
          >
            <p class="font-mono text-xs text-zinc-500 sm:pt-1.5">
              <time [attr.datetime]="article.publishedAt">{{
                formatDate(article.publishedAt)
              }}</time>
            </p>
            <div>
              <h2
                class="text-xl font-semibold tracking-tight text-zinc-950 group-hover:text-accent-700 dark:text-white dark:group-hover:text-accent-400"
              >
                <a
                  [routerLink]="link(article.slug)"
                  class="after:absolute after:inset-0 after:content-['']"
                  >{{ article.title }}</a
                >
              </h2>
              <p
                class="mt-2 max-w-prose text-sm leading-6 text-zinc-600 dark:text-zinc-400"
              >
                {{ article.excerpt }}
              </p>
              <div class="mt-4 flex flex-wrap items-center gap-2">
                <tg-badge tone="accent">{{ article.category }}</tg-badge>
                @for (tag of article.tags; track tag) {
                  <tg-badge>#{{ tag }}</tg-badge>
                }
                <span class="font-mono text-xs text-zinc-500"
                  >· {{ article.readingMinutes }} min read</span
                >
              </div>
            </div>
          </article>
        </li>
      }
    </ol>
  `,
})
export class ArticleTeasers {
  readonly articles = input.required<readonly ArticleSummary[]>();
  protected readonly formatDate = formatDate;
  protected link(slug: string): string {
    return remoteLink('blog', slug);
  }
}
