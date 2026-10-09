import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { Container, SplitLayout } from '@tg-labs/shared-layout';
import { TOOLS } from './tools.catalog';

/** Root component of the Tools remote (carries the remote's stylesheet). */
@Component({
  selector: 'tg-tools-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Container, SplitLayout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './tools-layout.css',
  template: `
    <tg-container width="wide" class="py-10 sm:py-14">
      <tg-split-layout asideLabel="Tools">
        <nav tgAside aria-label="Tools" class="text-sm">
          <a
            [routerLink]="home"
            routerLinkActive="text-accent-700! dark:text-accent-400!"
            [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page"
            class="font-semibold text-zinc-950 dark:text-white"
            >All tools</a
          >
          <ul class="mt-3 space-y-0.5 border-l border-zinc-200 dark:border-zinc-800">
            @for (tool of tools; track tool.slug) {
              <li>
                <a
                  [routerLink]="link(tool.slug)"
                  routerLinkActive="border-accent-600! font-medium text-zinc-950! dark:border-accent-400! dark:text-white!"
                  ariaCurrentWhenActive="page"
                  class="-ml-px block border-l border-transparent py-1 pl-3 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                  >{{ tool.name }}</a
                >
              </li>
            }
          </ul>
          <p class="mt-6 rounded-md bg-zinc-50 p-3 text-xs leading-5 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            Everything runs locally in your browser. Inputs are never uploaded.
          </p>
        </nav>
        <router-outlet />
      </tg-split-layout>
    </tg-container>
  `,
})
export class ToolsLayout {
  protected readonly tools = TOOLS;
  protected readonly home = remoteLink('tools');
  protected link(slug: string): string {
    return remoteLink('tools', slug);
  }
}
