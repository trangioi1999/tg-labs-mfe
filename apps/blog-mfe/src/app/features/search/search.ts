import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeader, StateMessage } from '@tg-labs/shared-ui';
import { map } from 'rxjs';
import { ArticleStore } from '../../data-access/article-store';
import { ArticleTeasers } from '../../ui/article-teasers';

/**
 * Client-side search over the mock articles. The query lives in the URL
 * (`?q=`) so results are shareable and survive a refresh.
 */
@Component({
  selector: 'tg-blog-search',
  imports: [PageHeader, StateMessage, ArticleTeasers],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header eyebrow="Blog" heading="Search articles" />
    <form role="search" class="mt-8" (submit)="$event.preventDefault()">
      <label for="blog-search" class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Search by title, topic or tag</label>
      <input
        id="blog-search"
        type="search"
        autocomplete="off"
        placeholder="e.g. signals, docker, postgres"
        class="mt-2 block w-full max-w-xl rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-accent-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        #searchInput
        [value]="query()"
        (input)="onInput(searchInput.value)"
      />
    </form>
    <div class="mt-6" aria-live="polite">
      @if (query().trim()) {
        <p class="text-sm text-zinc-500">{{ results().length }} {{ results().length === 1 ? 'result' : 'results' }} for “{{ query() }}”</p>
        @if (results().length) {
          <tg-article-teasers [articles]="results()" />
        } @else {
          <tg-state-message class="mt-6" heading="No matching articles" message="Try a broader term or browse by tag." />
        }
      }
    </div>
  `,
})
export class Search {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ArticleStore);

  protected readonly query = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('q') ?? '')),
    { requireSync: true },
  );
  protected readonly results = computed(() => this.store.search(this.query()));

  protected onInput(value: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: value || null },
      replaceUrl: true,
    });
  }
}
