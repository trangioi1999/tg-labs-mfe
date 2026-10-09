import {
  ChangeDetectionStrategy,
  Component,
  VERSION,
  computed,
  inject,
  isDevMode,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { REMOTE_LIST } from '@tg-labs/shared-config';
import { Button } from '@tg-labs/shared-ui';
import { RemoteRegistry } from '../../../core/federation/remote-registry';
import { SiteNav } from '../../../core/navigation/site-nav';
import {
  ACCENTS,
  PreferencesService,
} from '../../../core/preferences/preferences';
import { Icon, SECTION_ICONS } from '../../../shared/icon';
import { SettingsPanel } from '../settings-panel';
import { type HealthStatus, RemoteHealthService } from './remote-health';

const STATUS: Record<HealthStatus, { label: string; dot: string }> = {
  online: { label: 'Online', dot: 'bg-emerald-500' },
  offline: { label: 'Unreachable', dot: 'bg-rose-500' },
  checking: { label: 'Checking…', dot: 'bg-amber-400 animate-pulse' },
  disabled: { label: 'Not deployed', dot: 'bg-zinc-300 dark:bg-zinc-600' },
};

@Component({
  selector: 'tg-settings-dashboard',
  imports: [RouterLink, Button, Icon, SettingsPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <dl class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        @for (card of cards(); track card.label) {
          <div
            class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <dt class="text-xs font-medium text-zinc-500">{{ card.label }}</dt>
            <dd
              class="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white"
            >
              @if (card.swatch) {
                <span
                  class="size-5 rounded-full ring-2 ring-white dark:ring-zinc-900"
                  [style.background]="card.swatch"
                ></span>
              }
              {{ card.value }}
            </dd>
            <p class="mt-1 text-xs text-zinc-500">{{ card.hint }}</p>
          </div>
        }
      </dl>

      <tg-settings-panel
        heading="Micro frontends"
        description="Live status of every remote, read from its remoteEntry.json."
      >
        <button
          panel-action
          tgButton
          variant="secondary"
          size="sm"
          type="button"
          (click)="health.checkAll()"
        >
          <tg-icon name="refresh" class="size-3.5" /> Check again
        </button>
        <div
          class="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800"
        >
          <table class="w-full min-w-[36rem] text-left text-sm">
            <thead class="bg-zinc-50 text-xs text-zinc-500 dark:bg-zinc-900/60">
              <tr>
                <th scope="col" class="px-4 py-2.5 font-medium">Section</th>
                <th scope="col" class="px-4 py-2.5 font-medium">Status</th>
                <th scope="col" class="px-4 py-2.5 font-medium">Latency</th>
                <th scope="col" class="px-4 py-2.5 font-medium">Exposes</th>
                <th scope="col" class="px-4 py-2.5 font-medium">Visible</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
              @for (remote of remotes; track remote.name) {
                @let h = health.health()[remote.name];
                @let status = statusOf(h?.status);
                <tr>
                  <td class="px-4 py-3">
                    <span class="flex items-center gap-3">
                      <tg-icon
                        [name]="icons[remote.basePath]"
                        class="size-4 text-zinc-400"
                      />
                      <span>
                        <span
                          class="block font-medium text-zinc-950 dark:text-white"
                          >{{ remote.label }}</span
                        >
                        <span class="block font-mono text-xs text-zinc-500">{{
                          remote.name
                        }}</span>
                      </span>
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="inline-flex items-center gap-2 text-zinc-700 dark:text-zinc-300"
                      [attr.title]="h?.error"
                    >
                      <span
                        class="size-2 rounded-full"
                        [class]="status.dot"
                      ></span>
                      {{ status.label }}
                    </span>
                  </td>
                  <td
                    class="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    {{
                      h?.latencyMs !== undefined ? h?.latencyMs + ' ms' : '—'
                    }}
                  </td>
                  <td
                    class="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    {{ h?.exposes ?? '—' }}
                  </td>
                  <td class="px-4 py-3 text-xs">
                    @if (siteNav.isVisible(remote.name)) {
                      <span class="text-emerald-700 dark:text-emerald-400"
                        >Shown</span
                      >
                    } @else {
                      <a
                        routerLink="/settings/sections"
                        class="text-zinc-500 underline underline-offset-2"
                        >Hidden</a
                      >
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        @if (health.checkedAt(); as at) {
          <p class="mt-3 text-xs text-zinc-500">
            Last checked at {{ at.toLocaleTimeString() }}
          </p>
        }
      </tg-settings-panel>

      <div class="grid gap-6 lg:grid-cols-2">
        <tg-settings-panel heading="Environment">
          <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
            @for (row of environment; track row.label) {
              <dt class="text-zinc-500">{{ row.label }}</dt>
              <dd
                class="font-mono text-xs leading-5 text-zinc-800 dark:text-zinc-200 break-all"
              >
                {{ row.value }}
              </dd>
            }
          </dl>
        </tg-settings-panel>

        <tg-settings-panel heading="Shortcuts">
          <ul class="space-y-2">
            @for (link of shortcuts; track link.path) {
              <li>
                <a
                  [routerLink]="link.path"
                  class="group flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm transition-colors hover:border-accent-400 dark:border-zinc-800 dark:hover:border-accent-700"
                >
                  <span>
                    <span
                      class="block font-medium text-zinc-950 dark:text-white"
                      >{{ link.label }}</span
                    >
                    <span class="block text-xs text-zinc-500">{{
                      link.hint
                    }}</span>
                  </span>
                  <tg-icon
                    name="arrowRight"
                    class="size-4 text-zinc-400 transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            }
          </ul>
        </tg-settings-panel>
      </div>
    </div>
  `,
})
export class Dashboard {
  private readonly registry = inject(RemoteRegistry);
  private readonly prefs = inject(PreferencesService);
  protected readonly siteNav = inject(SiteNav);
  protected readonly health = inject(RemoteHealthService);
  protected readonly remotes = REMOTE_LIST;
  protected readonly icons = SECTION_ICONS;

  protected readonly cards = computed(() => {
    const prefs = this.prefs.preferences();
    const accent = ACCENTS.find((a) => a.id === prefs.accent) ?? ACCENTS[0];
    const health = this.health.health();
    const online = this.registry.enabled.filter(
      (remote) => health[remote.name]?.status === 'online',
    ).length;
    return [
      {
        label: 'Sections deployed',
        value: `${this.registry.enabled.length} / ${REMOTE_LIST.length}`,
        hint: 'Controlled by ENABLED_REMOTES',
      },
      {
        label: 'Remotes online',
        value: `${online} / ${this.registry.enabled.length}`,
        hint: 'Reachable right now',
      },
      {
        label: 'Sections shown',
        value: `${this.siteNav.sections().length}`,
        hint: 'After your Sections settings',
      },
      {
        label: 'Theme',
        value: `${capitalise(prefs.theme)}`,
        hint: `${accent.label} accent · ${prefs.fontScale.toUpperCase()} text`,
        swatch: accent.swatch,
      },
    ];
  });

  protected readonly environment = [
    { label: 'Angular', value: VERSION.full },
    { label: 'Build', value: isDevMode() ? 'development' : 'production' },
    { label: 'Manifest', value: '/federation.manifest.json' },
    { label: 'Storage', value: 'localStorage · tg-preferences' },
  ];

  protected readonly shortcuts = [
    {
      path: '/settings/appearance',
      label: 'Appearance',
      hint: 'Theme, accent colour and text size',
    },
    {
      path: '/settings/sections',
      label: 'Sections',
      hint: 'Show or hide sections and home blocks',
    },
    { path: '/about', label: 'About', hint: 'How TG Labs is built' },
  ];

  constructor() {
    void this.health.checkAll();
  }

  protected statusOf(status: HealthStatus | undefined) {
    return STATUS[status ?? 'checking'];
  }
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
