import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { REMOTE_LIST, SITE } from '@tg-labs/shared-config';
import { Container } from '@tg-labs/shared-layout';
import { RemoteRegistry } from '../../core/federation/remote-registry';
import { SiteNav } from '../../core/navigation/site-nav';

const LINK =
  'text-zinc-600 transition-colors hover:text-accent-700 dark:text-zinc-400 dark:hover:text-accent-300';

@Component({
  selector: 'tg-footer',
  imports: [RouterLink, Container],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block border-t border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40',
  },
  template: `
    <tg-container width="wide">
      <div class="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div class="lg:col-span-2">
          <div class="flex items-center gap-3">
            <span
              class="grid size-8 place-items-center rounded-lg bg-linear-to-br from-accent-500 to-accent-800 font-mono text-[0.65rem] font-bold text-white"
              aria-hidden="true"
              >TG</span
            >
            <p class="text-base font-semibold text-zinc-950 dark:text-white">
              {{ site.name }}
            </p>
          </div>
          <p
            class="mt-3 font-mono text-sm text-accent-700 dark:text-accent-400"
          >
            {{ site.tagline }}
          </p>
          <p
            class="mt-3 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400"
          >
            {{ site.description }}
          </p>
          <p
            class="mt-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
          >
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none"
              ></span>
              <span
                class="relative inline-flex size-2 rounded-full bg-emerald-500"
              ></span>
            </span>
            {{ deployed }} of {{ total }} sections deployed
          </p>
        </div>
        <nav aria-label="Sections">
          <h2
            class="font-mono text-xs font-medium tracking-widest text-zinc-500 uppercase"
          >
            Sections
          </h2>
          <ul class="mt-4 space-y-2.5 text-sm">
            @for (item of siteNav.sections(); track item.path) {
              <li>
                <a [routerLink]="item.path" class="${LINK}">{{ item.label }}</a>
              </li>
            }
          </ul>
        </nav>
        <nav aria-label="Project">
          <h2
            class="font-mono text-xs font-medium tracking-widest text-zinc-500 uppercase"
          >
            Project
          </h2>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li><a routerLink="/about" class="${LINK}">About</a></li>
            <li><a routerLink="/settings" class="${LINK}">Settings</a></li>
            <li>
              <a
                [href]="site.repositoryUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="${LINK}"
                >Source code</a
              >
            </li>
          </ul>
        </nav>
      </div>
      <div
        class="flex flex-col gap-2 border-t border-zinc-200 py-6 text-xs text-zinc-500 sm:flex-row sm:justify-between dark:border-zinc-800"
      >
        <p>
          © {{ year }} {{ site.name }}. Content licensed for learning and
          sharing.
        </p>
        <p class="font-mono">angular · native federation · nx</p>
      </div>
    </tg-container>
  `,
})
export class Footer {
  private readonly registry = inject(RemoteRegistry);
  protected readonly site = SITE;
  protected readonly siteNav = inject(SiteNav);
  protected readonly deployed = this.registry.enabled.length;
  protected readonly total = REMOTE_LIST.length;
  protected readonly year = new Date().getFullYear();
}
