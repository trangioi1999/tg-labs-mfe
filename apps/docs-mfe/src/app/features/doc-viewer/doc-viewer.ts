import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { Button, ContentBlocks, StateMessage } from '@tg-labs/shared-ui';
import { formatDate } from '@tg-labs/shared-utils';
import { map } from 'rxjs';
import { DocsStore } from '../../data-access/docs-store';

@Component({
  selector: 'tg-doc-viewer',
  imports: [RouterLink, Button, ContentBlocks, StateMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (page(); as page) {
      <article>
        <p class="font-mono text-xs font-medium tracking-widest text-accent-700 uppercase dark:text-accent-400">
          {{ store.sectionTitle(page.section) }}
        </p>
        <h1 class="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{{ page.title }}</h1>
        <p class="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">{{ page.summary }}</p>
        <tg-content-blocks class="mt-4" [blocks]="page.body" />
        <p class="mt-10 font-mono text-xs text-zinc-500">
          Last updated <time [attr.datetime]="page.updatedAt">{{ formatDate(page.updatedAt) }}</time>
        </p>
        <nav aria-label="Previous and next page" class="mt-6 grid gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">
          @if (neighbours().previous; as previous) {
            <a [routerLink]="link(previous.slug)" class="rounded-lg border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
              <span class="block font-mono text-xs text-zinc-500">← Previous</span>
              <span class="mt-1 block font-medium text-zinc-950 dark:text-white">{{ previous.title }}</span>
            </a>
          } @else {
            <span></span>
          }
          @if (neighbours().next; as next) {
            <a [routerLink]="link(next.slug)" class="rounded-lg border border-zinc-200 p-4 text-right hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
              <span class="block font-mono text-xs text-zinc-500">Next →</span>
              <span class="mt-1 block font-medium text-zinc-950 dark:text-white">{{ next.title }}</span>
            </a>
          }
        </nav>
      </article>
    } @else {
      <tg-state-message heading="Page not found" message="This documentation page does not exist.">
        <a tgButton variant="secondary" [routerLink]="homeLink">Docs overview</a>
      </tg-state-message>
    }
  `,
})
export class DocViewer {
  protected readonly store = inject(DocsStore);
  private readonly slug = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { requireSync: true },
  );

  protected readonly page = computed(() => this.store.page(this.slug()));
  protected readonly neighbours = computed(() => this.store.neighbours(this.slug()));
  protected readonly homeLink = remoteLink('docs');
  protected readonly formatDate = formatDate;

  protected link(slug: string): string {
    return remoteLink('docs', slug);
  }
}
