import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { REMOTE_LIST, SITE } from '@tg-labs/shared-config';
import { Container } from '@tg-labs/shared-layout';
import { PageHeader } from '@tg-labs/shared-ui';

@Component({
  selector: 'tg-about',
  imports: [RouterLink, Container, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-container width="prose" class="py-16">
      <tg-page-header eyebrow="About" [heading]="'About ' + site.name" [description]="site.description" />
      <div class="mt-10 space-y-4 text-base leading-7 text-zinc-700 dark:text-zinc-300">
        <p>
          {{ site.name }} is a personal developer portal built as a set of independently deployable Angular
          applications. The Shell you are looking at owns the layout and navigation; every section below is a
          separate micro frontend loaded at runtime with Native Federation.
        </p>
        <ul class="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          @for (remote of remotes; track remote.name) {
            <li class="flex items-baseline justify-between gap-4 px-4 py-3">
              <a [routerLink]="'/' + remote.basePath" class="font-medium text-zinc-950 hover:text-accent-700 dark:text-white dark:hover:text-accent-400">{{ remote.label }}</a>
              <code class="font-mono text-xs text-zinc-500">{{ remote.name }}</code>
            </li>
          }
        </ul>
      </div>
    </tg-container>
  `,
})
export class About {
  protected readonly site = SITE;
  protected readonly remotes = REMOTE_LIST;
}
