import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { Card, PageHeader } from '@tg-labs/shared-ui';
import { DocsStore } from '../../data-access/docs-store';

@Component({
  selector: 'tg-docs-home',
  imports: [RouterLink, Card, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header
      eyebrow="Docs"
      heading="Engineering documentation"
      description="Guides for building, running and extending TG Labs — and the engineering notes behind its architecture."
    />
    @for (section of sections; track section.slug) {
      <section class="mt-10" [attr.aria-labelledby]="'section-' + section.slug">
        <h2 [id]="'section-' + section.slug" class="text-lg font-semibold text-zinc-950 dark:text-white">{{ section.title }}</h2>
        <ul class="mt-4 grid gap-4 sm:grid-cols-2">
          @for (page of section.pages; track page.slug) {
            <li class="flex">
              <tg-card [interactive]="true" class="w-full">
                <a [routerLink]="link(page.slug)" class="font-medium text-zinc-950 after:absolute after:inset-0 after:content-[''] dark:text-white">{{ page.title }}</a>
                <p class="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{{ page.summary }}</p>
              </tg-card>
            </li>
          }
        </ul>
      </section>
    }
  `,
})
export class DocsHome {
  protected readonly sections = inject(DocsStore).sections();
  protected link(slug: string): string {
    return remoteLink('docs', slug);
  }
}
