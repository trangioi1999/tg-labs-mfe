import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { REMOTE_LIST } from '@tg-labs/shared-config';
import { Badge } from '@tg-labs/shared-ui';
import { RemoteRegistry } from '../../../core/federation/remote-registry';
import {
  HOME_BLOCKS,
  PreferencesService,
} from '../../../core/preferences/preferences';
import { Icon, SECTION_ICONS } from '../../../shared/icon';
import { Switch } from '../../../shared/switch';
import { SettingsPanel } from '../settings-panel';

@Component({
  selector: 'tg-settings-sections',
  imports: [RouterLink, Badge, Icon, Switch, SettingsPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <tg-settings-panel
        heading="Sections"
        description="Hidden sections disappear from the navigation and the home page. Their links keep working."
      >
        <ul
          class="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800"
        >
          @for (remote of remotes; track remote.name) {
            @let deployed = registry.isEnabled(remote.name);
            <li class="flex items-center gap-4 p-4">
              <span
                class="grid size-10 shrink-0 place-items-center rounded-lg"
                [class]="
                  deployed
                    ? 'bg-accent-50 text-accent-700 dark:bg-accent-950/60 dark:text-accent-300'
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-900'
                "
              >
                <tg-icon [name]="icons[remote.basePath]" class="size-5" />
              </span>
              <div class="min-w-0 flex-1">
                <p
                  class="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-950 dark:text-white"
                >
                  {{ remote.label }}
                  @if (!deployed) {
                    <tg-badge>not deployed</tg-badge>
                  }
                </p>
                <p class="mt-0.5 truncate text-sm text-zinc-500">
                  {{ remote.description }}
                </p>
              </div>
              <tg-switch
                [label]="'Show ' + remote.label"
                [checked]="deployed && prefs.isSectionVisible(remote.name)"
                [disabled]="!deployed"
                (checkedChange)="prefs.setSectionVisible(remote.name, $event)"
              />
            </li>
          }
        </ul>
        <p class="mt-4 flex items-start gap-2 text-xs leading-5 text-zinc-500">
          <tg-icon name="info" class="mt-0.5 size-3.5" />
          <span>
            “Not deployed” sections are turned off for the whole site with the
            <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800"
              >ENABLED_REMOTES</code
            >
            build variable and cannot be shown from here. See the
            <a
              routerLink="/settings"
              class="text-accent-700 underline underline-offset-2 dark:text-accent-400"
              >dashboard</a
            >
            for their status.
          </span>
        </p>
      </tg-settings-panel>

      <tg-settings-panel
        heading="Home page"
        description="Choose which blocks appear on the home page."
      >
        <ul
          class="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800"
        >
          @for (block of blocks; track block.id) {
            <li class="flex items-center gap-4 p-4">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-zinc-950 dark:text-white">
                  {{ block.label }}
                </p>
                <p class="mt-0.5 text-sm text-zinc-500">
                  {{ block.description }}
                </p>
              </div>
              <tg-switch
                [label]="'Show ' + block.label"
                [checked]="prefs.isBlockVisible(block.id)"
                (checkedChange)="prefs.setBlockVisible(block.id, $event)"
              />
            </li>
          }
        </ul>
      </tg-settings-panel>
    </div>
  `,
})
export class Sections {
  protected readonly registry = inject(RemoteRegistry);
  protected readonly prefs = inject(PreferencesService);
  protected readonly remotes = REMOTE_LIST;
  protected readonly blocks = HOME_BLOCKS;
  protected readonly icons = SECTION_ICONS;
}
