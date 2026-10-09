import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMARY_NAV } from '@tg-labs/shared-config';
import { Container } from '@tg-labs/shared-layout';
import { Button } from '@tg-labs/shared-ui';

@Component({
  selector: 'tg-not-found',
  imports: [RouterLink, Container, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-container width="prose" class="py-24">
      <p
        class="font-mono text-sm font-medium text-accent-700 dark:text-accent-400"
      >
        404
      </p>
      <h1
        class="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white"
      >
        Page not found
      </h1>
      <p class="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
        The page you are looking for does not exist or has moved. Try one of the
        sections below.
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a tgButton routerLink="/">Back to home</a>
        @for (item of nav; track item.path) {
          <a tgButton variant="ghost" [routerLink]="item.path">{{
            item.label
          }}</a>
        }
      </div>
    </tg-container>
  `,
})
export class NotFound {
  protected readonly nav = PRIMARY_NAV;
}
