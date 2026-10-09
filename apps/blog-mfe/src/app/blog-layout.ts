import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { Container } from '@tg-labs/shared-layout';

/**
 * Root component of the Blog remote. It is the parent of every Blog route,
 * so its stylesheet (unencapsulated) delivers the remote's Tailwind
 * utilities whether it runs inside the Shell or standalone.
 */
@Component({
  selector: 'tg-blog-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Container],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './blog-layout.css',
  template: `
    <tg-container class="py-10 sm:py-14">
      <nav aria-label="Blog" class="mb-10 overflow-x-auto">
        <ul class="flex gap-1 border-b border-zinc-200 text-sm dark:border-zinc-800">
          @for (item of links; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="border-accent-600! text-zinc-950! dark:border-accent-400! dark:text-white!"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                ariaCurrentWhenActive="page"
                class="-mb-px block border-b-2 border-transparent px-3 py-2 whitespace-nowrap text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                >{{ item.label }}</a
              >
            </li>
          }
        </ul>
      </nav>
      <router-outlet />
    </tg-container>
  `,
})
export class BlogLayout {
  protected readonly links = [
    { label: 'Latest', path: remoteLink('blog'), exact: true },
    { label: 'Categories', path: remoteLink('blog', 'categories'), exact: false },
    { label: 'Tags', path: remoteLink('blog', 'tags'), exact: false },
    { label: 'Search', path: remoteLink('blog', 'search'), exact: false },
  ];
}
