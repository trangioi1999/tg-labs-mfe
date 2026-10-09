import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { PageHeader, StateMessage } from '@tg-labs/shared-ui';
import { map } from 'rxjs';
import { DocsStore } from '../../data-access/docs-store';

@Component({
  selector: 'tg-docs-search',
  imports: [RouterLink, PageHeader, StateMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header eyebrow="Docs" heading="Search documentation" />
    <form role="search" class="mt-8" (submit)="$event.preventDefault()">
      <label for="docs-search" class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Search all pages</label>
      <input
        id="docs-search"
        #searchInput
        type="search"
        autocomplete="off"
        placeholder="e.g. routing, docker, ci"
        class="mt-2 block w-full max-w-xl rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-accent-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        [value]="query()"
        (input)="onInput(searchInput.value)"
      />
    </form>
    <div class="mt-6" aria-live="polite">
      @if (query().trim()) {
        @if (results().length) {
          <ul class="divide-y divide-zinc-200 dark:divide-zinc-800">
            @for (page of results(); track page.slug) {
              <li class="py-4">
                <a [routerLink]="link(page.slug)" class="font-medium text-zinc-950 hover:text-accent-700 dark:text-white dark:hover:text-accent-400">{{ page.title }}</a>
                <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{{ page.summary }}</p>
              </li>
            }
          </ul>
        } @else {
          <tg-state-message heading="No matching pages" message="Try a different keyword." />
        }
      }
    </div>
  `,
})
export class DocsSearch {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(DocsStore);

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

  protected link(slug: string): string {
    return remoteLink('docs', slug);
  }
}
