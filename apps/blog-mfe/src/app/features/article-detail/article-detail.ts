import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { Badge, Button, ContentBlocks, StateMessage } from '@tg-labs/shared-ui';
import { formatDate } from '@tg-labs/shared-utils';
import { map } from 'rxjs';
import { ArticleStore } from '../../data-access/article-store';

@Component({
  selector: 'tg-article-detail',
  imports: [RouterLink, Badge, Button, ContentBlocks, StateMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (article(); as article) {
      <article class="mx-auto max-w-3xl">
        <header class="border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <a
            [routerLink]="categoryLink(article.category)"
            class="font-mono text-xs font-medium tracking-widest text-accent-700 uppercase hover:underline dark:text-accent-400"
          >
            {{ article.category }}
          </a>
          <h1
            class="mt-3 text-3xl font-semibold tracking-tight text-balance text-zinc-950 sm:text-4xl dark:text-white"
          >
            {{ article.title }}
          </h1>
          <p class="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {{ article.excerpt }}
          </p>
          <p class="mt-6 font-mono text-xs text-zinc-500">
            {{ article.author.name }} ·
            <time [attr.datetime]="article.publishedAt">{{
              formatDate(article.publishedAt)
            }}</time>
            · {{ article.readingMinutes }} min read
          </p>
        </header>
        <tg-content-blocks class="mt-6" [blocks]="article.body" />
        <footer
          class="mt-12 flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-6 dark:border-zinc-800"
        >
          <span class="mr-1 text-sm text-zinc-500">Tagged</span>
          @for (tag of article.tags; track tag) {
            <a [routerLink]="tagLink(tag)" class="rounded-full"
              ><tg-badge>#{{ tag }}</tg-badge></a
            >
          }
        </footer>
      </article>
    } @else {
      <tg-state-message
        heading="Article not found"
        message="It may have been renamed or unpublished."
      >
        <a tgButton variant="secondary" [routerLink]="blogLink"
          >Browse all articles</a
        >
      </tg-state-message>
    }
  `,
})
export class ArticleDetail {
  private readonly store = inject(ArticleStore);
  private readonly slug = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
    ),
    { requireSync: true },
  );

  protected readonly article = computed(() => this.store.bySlug(this.slug()));
  protected readonly blogLink = remoteLink('blog');
  protected readonly formatDate = formatDate;

  protected categoryLink(slug: string): string {
    return remoteLink('blog', 'category', slug);
  }

  protected tagLink(tag: string): string {
    return remoteLink('blog', 'tag', tag);
  }
}
