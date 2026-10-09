import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { DocsStore } from '../data-access/docs-store';

/** Sidebar navigation listing every documentation section and page. */
@Component({
  selector: 'tg-docs-nav',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Documentation" class="text-sm">
      <a
        [routerLink]="home"
        routerLinkActive="text-accent-700! dark:text-accent-400!"
        [routerLinkActiveOptions]="{ exact: true }"
        ariaCurrentWhenActive="page"
        class="font-semibold text-zinc-950 dark:text-white"
        >Overview</a
      >
      @for (section of sections; track section.slug) {
        <p class="mt-6 font-mono text-xs font-medium tracking-widest text-zinc-500 uppercase">{{ section.title }}</p>
        <ul class="mt-2 space-y-0.5 border-l border-zinc-200 dark:border-zinc-800">
          @for (page of section.pages; track page.slug) {
            <li>
              <a
                [routerLink]="link(page.slug)"
                routerLinkActive="border-accent-600! font-medium text-zinc-950! dark:border-accent-400! dark:text-white!"
                ariaCurrentWhenActive="page"
                class="-ml-px block border-l border-transparent py-1 pl-3 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                >{{ page.title }}</a
              >
            </li>
          }
        </ul>
      }
      <a [routerLink]="searchLink" class="mt-6 inline-block text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">Search docs →</a>
    </nav>
  `,
})
export class DocsNav {
  protected readonly sections = inject(DocsStore).sections();
  protected readonly home = remoteLink('docs');
  protected readonly searchLink = remoteLink('docs', 'search');

  protected link(slug: string): string {
    return remoteLink('docs', slug);
  }
}
