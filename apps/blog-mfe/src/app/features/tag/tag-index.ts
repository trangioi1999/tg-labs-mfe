import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { PageHeader } from '@tg-labs/shared-ui';
import { ArticleStore } from '../../data-access/article-store';

@Component({
  selector: 'tg-tag-index',
  imports: [RouterLink, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header
      eyebrow="Blog"
      heading="Tags"
      description="Cross-cutting topics that span categories."
    />
    <ul class="mt-8 flex flex-wrap gap-2">
      @for (item of tags; track item.tag) {
        <li>
          <a
            [routerLink]="link(item.tag)"
            class="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 font-mono text-sm text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
          >
            #{{ item.tag }}
            <span class="text-xs text-zinc-400">{{ item.count }}</span>
          </a>
        </li>
      }
    </ul>
  `,
})
export class TagIndex {
  protected readonly tags = inject(ArticleStore).tags();
  protected link(tag: string): string {
    return remoteLink('blog', 'tag', tag);
  }
}
