import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Container } from '@tg-labs/shared-layout';
import { Button } from '@tg-labs/shared-ui';
import { PreferencesService } from '../../core/preferences/preferences';
import { Icon, type IconName } from '../../shared/icon';

interface Tab {
  path: string;
  label: string;
  hint: string;
  icon: IconName;
  exact: boolean;
}

/** Settings area: side navigation (top tabs on small screens) + content. */
@Component({
  selector: 'tg-settings-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Container,
    Button,
    Icon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40"
    >
      <tg-container width="wide" class="py-10">
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p
              class="font-mono text-xs font-medium tracking-widest text-accent-700 uppercase dark:text-accent-400"
            >
              Control center
            </p>
            <h1
              class="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white"
            >
              Settings
            </h1>
            <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Preferences are stored in this browser only — nothing is sent to a
              server.
            </p>
          </div>
          @if (prefs.isCustomised()) {
            <button
              tgButton
              variant="secondary"
              size="sm"
              type="button"
              (click)="prefs.reset()"
            >
              <tg-icon name="reset" class="size-3.5" /> Reset to defaults
            </button>
          }
        </div>
      </tg-container>
    </div>

    <tg-container width="wide" class="py-10">
      <div
        class="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]"
      >
        <nav aria-label="Settings" class="min-w-0">
          <ul
            class="-mx-1 flex gap-1 overflow-x-auto px-1 lg:mx-0 lg:flex-col lg:px-0"
          >
            @for (tab of tabs; track tab.path) {
              <li class="shrink-0">
                <a
                  [routerLink]="tab.path"
                  routerLinkActive="bg-white text-zinc-950! shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-white! dark:ring-zinc-800"
                  [routerLinkActiveOptions]="{ exact: tab.exact }"
                  ariaCurrentWhenActive="page"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                >
                  <tg-icon [name]="tab.icon" class="size-4" />
                  <span>
                    {{ tab.label }}
                    <span
                      class="hidden text-xs font-normal text-zinc-500 lg:block"
                      >{{ tab.hint }}</span
                    >
                  </span>
                </a>
              </li>
            }
          </ul>
        </nav>
        <div class="min-w-0">
          <router-outlet />
        </div>
      </div>
    </tg-container>
  `,
})
export class SettingsLayout {
  protected readonly prefs = inject(PreferencesService);
  protected readonly tabs: readonly Tab[] = [
    {
      path: '/settings',
      label: 'Dashboard',
      hint: 'Status and overview',
      icon: 'dashboard',
      exact: true,
    },
    {
      path: '/settings/appearance',
      label: 'Appearance',
      hint: 'Theme, colour, text size',
      icon: 'palette',
      exact: false,
    },
    {
      path: '/settings/sections',
      label: 'Sections',
      hint: 'Show or hide content',
      icon: 'layers',
      exact: false,
    },
  ];
}
