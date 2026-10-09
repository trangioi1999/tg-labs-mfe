import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMARY_NAV, SITE } from '@tg-labs/shared-config';
import { Container } from '@tg-labs/shared-layout';

@Component({
  selector: 'tg-footer',
  imports: [RouterLink, Container],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40' },
  template: `
    <tg-container width="wide">
      <div class="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div class="lg:col-span-2">
          <p class="text-base font-semibold text-zinc-950 dark:text-white">{{ site.name }}</p>
          <p class="mt-1 font-mono text-sm text-accent-700 dark:text-accent-400">{{ site.tagline }}</p>
          <p class="mt-4 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">{{ site.description }}</p>
        </div>
        <nav aria-label="Sections">
          <h2 class="font-mono text-xs font-medium tracking-widest text-zinc-500 uppercase">Sections</h2>
          <ul class="mt-4 space-y-2 text-sm">
            @for (item of nav; track item.path) {
              <li>
                <a [routerLink]="item.path" class="text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">{{ item.label }}</a>
              </li>
            }
          </ul>
        </nav>
        <nav aria-label="Project">
          <h2 class="font-mono text-xs font-medium tracking-widest text-zinc-500 uppercase">Project</h2>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a routerLink="/about" class="text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">About</a></li>
            <li>
              <a [href]="site.repositoryUrl" target="_blank" rel="noopener noreferrer" class="text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">Source code</a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="flex flex-col gap-2 border-t border-zinc-200 py-6 text-xs text-zinc-500 sm:flex-row sm:justify-between dark:border-zinc-800">
        <p>© {{ year }} {{ site.name }}. Content licensed for learning and sharing.</p>
        <p class="font-mono">angular · native federation · nx</p>
      </div>
    </tg-container>
  `,
})
export class Footer {
  protected readonly site = SITE;
  protected readonly nav = PRIMARY_NAV;
  protected readonly year = new Date().getFullYear();
}
