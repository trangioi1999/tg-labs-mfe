import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { Card, PageHeader } from '@tg-labs/shared-ui';
import { TOOLS } from '../../tools.catalog';

@Component({
  selector: 'tg-tools-home',
  imports: [RouterLink, Card, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header
      eyebrow="Tools"
      heading="Developer utilities"
      description="Small, focused tools for everyday debugging. No sign-in, no tracking, no server round-trips."
    />
    <ul class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      @for (tool of tools; track tool.slug) {
        <li class="flex">
          <tg-card [interactive]="true" class="w-full">
            <a
              [routerLink]="link(tool.slug)"
              class="font-semibold text-zinc-950 after:absolute after:inset-0 after:content-[''] dark:text-white"
              >{{ tool.name }}</a
            >
            <p class="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {{ tool.summary }}
            </p>
          </tg-card>
        </li>
      }
    </ul>
  `,
})
export class ToolsHome {
  protected readonly tools = TOOLS;
  protected link(slug: string): string {
    return remoteLink('tools', slug);
  }
}
