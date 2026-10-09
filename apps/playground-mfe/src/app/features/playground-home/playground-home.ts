import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { Badge, Card, PageHeader } from '@tg-labs/shared-ui';
import { EXPERIMENTS } from '../../experiments';

@Component({
  selector: 'tg-playground-home',
  imports: [RouterLink, Badge, Card, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header
      eyebrow="Playground"
      heading="Experiments & demos"
      description="A sandbox for interactive technical demos. Some are polished, most are works in progress — that is the point."
    />
    <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      @for (experiment of experiments; track experiment.slug) {
        <li class="flex">
          <tg-card [interactive]="experiment.status === 'live'" class="w-full">
            <div class="flex items-center justify-between gap-2">
              @if (experiment.status === 'live') {
                <a [routerLink]="link(experiment.slug)" class="font-semibold text-zinc-950 after:absolute after:inset-0 after:content-[''] dark:text-white">{{ experiment.title }}</a>
              } @else {
                <span class="font-semibold text-zinc-500">{{ experiment.title }}</span>
              }
              <tg-badge [tone]="experiment.status === 'live' ? 'accent' : 'neutral'">{{ experiment.status }}</tg-badge>
            </div>
            <p class="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{{ experiment.summary }}</p>
          </tg-card>
        </li>
      }
    </ul>
  `,
})
export class PlaygroundHome {
  protected readonly experiments = EXPERIMENTS;
  protected link(slug: string): string {
    return remoteLink('playground', slug);
  }
}
