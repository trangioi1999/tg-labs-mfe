import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Badge, Button } from '@tg-labs/shared-ui';
import {
  ACCENTS,
  type FontScale,
  PreferencesService,
  type ThemeMode,
} from '../../../core/preferences/preferences';
import { Icon, type IconName } from '../../../shared/icon';
import { SettingsPanel } from '../settings-panel';

@Component({
  selector: 'tg-settings-appearance',
  imports: [Badge, Button, Icon, SettingsPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <tg-settings-panel
        heading="Theme"
        description="System follows your operating system and switches automatically."
      >
        <div
          class="grid gap-3 sm:grid-cols-3"
          role="radiogroup"
          aria-label="Theme"
        >
          @for (option of themes; track option.id) {
            <label
              class="group cursor-pointer rounded-xl border p-2 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-600"
              [class]="
                prefs.themeMode() === option.id
                  ? 'border-accent-500 ring-1 ring-accent-500'
                  : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
              "
            >
              <input
                type="radio"
                name="theme"
                class="sr-only"
                [value]="option.id"
                [checked]="prefs.themeMode() === option.id"
                (change)="prefs.update({ theme: option.id })"
              />
              <span
                class="block h-20 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
                aria-hidden="true"
              >
                @if (option.id === 'system') {
                  <span class="flex h-full">
                    <span class="flex-1 bg-white p-2"
                      ><span class="block h-2 w-10 rounded bg-zinc-300"></span
                    ></span>
                    <span class="flex-1 bg-zinc-900 p-2"
                      ><span class="block h-2 w-10 rounded bg-zinc-600"></span
                    ></span>
                  </span>
                } @else {
                  <span
                    class="block h-full p-2"
                    [class]="option.id === 'dark' ? 'bg-zinc-900' : 'bg-white'"
                  >
                    <span
                      class="block h-2 w-14 rounded"
                      [class]="
                        option.id === 'dark' ? 'bg-zinc-600' : 'bg-zinc-300'
                      "
                    ></span>
                    <span
                      class="mt-2 block h-2 w-20 rounded"
                      [class]="
                        option.id === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200'
                      "
                    ></span>
                    <span
                      class="mt-3 block h-4 w-12 rounded bg-accent-500"
                    ></span>
                  </span>
                }
              </span>
              <span
                class="mt-2 flex items-center gap-2 px-1 text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                <tg-icon [name]="option.icon" class="size-4" />
                {{ option.label }}
              </span>
            </label>
          }
        </div>
      </tg-settings-panel>

      <tg-settings-panel
        heading="Accent colour"
        description="Used for links, highlights and focus rings across every section."
      >
        <div
          class="flex flex-wrap gap-3"
          role="radiogroup"
          aria-label="Accent colour"
        >
          @for (accent of accents; track accent.id) {
            <label
              class="flex cursor-pointer flex-col items-center gap-1.5 has-focus-visible:[&>span:first-of-type]:outline-2 has-focus-visible:[&>span:first-of-type]:outline-offset-2 has-focus-visible:[&>span:first-of-type]:outline-zinc-500"
            >
              <input
                type="radio"
                name="accent"
                class="sr-only"
                [value]="accent.id"
                [checked]="prefs.preferences().accent === accent.id"
                (change)="prefs.update({ accent: accent.id })"
              />
              <span
                class="grid size-10 place-items-center rounded-full text-white shadow-sm ring-offset-2 ring-offset-white transition-transform hover:scale-110 motion-reduce:transform-none dark:ring-offset-zinc-950"
                [class]="
                  prefs.preferences().accent === accent.id
                    ? 'ring-2 ring-zinc-900 dark:ring-white'
                    : ''
                "
                [style.background]="accent.swatch"
              >
                @if (prefs.preferences().accent === accent.id) {
                  <tg-icon name="check" class="size-4" />
                }
              </span>
              <span class="text-xs text-zinc-600 dark:text-zinc-400">{{
                accent.label
              }}</span>
            </label>
          }
        </div>
      </tg-settings-panel>

      <tg-settings-panel
        heading="Text size"
        description="Scales all text and spacing on the site."
      >
        <div
          class="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900"
          role="radiogroup"
          aria-label="Text size"
        >
          @for (scale of scales; track scale.id) {
            <label
              class="cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent-600"
              [class]="
                prefs.preferences().fontScale === scale.id
                  ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
              "
            >
              <input
                type="radio"
                name="font-scale"
                class="sr-only"
                [value]="scale.id"
                [checked]="prefs.preferences().fontScale === scale.id"
                (change)="prefs.update({ fontScale: scale.id })"
              />
              {{ scale.label }}
            </label>
          }
        </div>
      </tg-settings-panel>

      <tg-settings-panel
        heading="Preview"
        description="How components look with your choices."
      >
        <div
          class="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/60"
        >
          <div class="flex flex-wrap items-center gap-2">
            <tg-badge tone="accent">angular</tg-badge>
            <tg-badge>native-federation</tg-badge>
          </div>
          <p class="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">
            Micro Frontends with Angular Native Federation
          </p>
          <p class="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            A dynamic host, a runtime manifest and
            <span
              class="font-medium text-accent-700 underline decoration-accent-300 underline-offset-2 dark:text-accent-400"
              >route-level contracts</span
            >.
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <button tgButton size="sm" type="button">Primary</button>
            <button tgButton size="sm" variant="secondary" type="button">
              Secondary
            </button>
            <span
              class="inline-flex h-8 items-center rounded-md bg-accent-600 px-3 text-sm font-medium text-white"
              >Accent</span
            >
          </div>
        </div>
      </tg-settings-panel>
    </div>
  `,
})
export class Appearance {
  protected readonly prefs = inject(PreferencesService);
  protected readonly accents = ACCENTS;
  protected readonly themes: readonly {
    id: ThemeMode;
    label: string;
    icon: IconName;
  }[] = [
    { id: 'light', label: 'Light', icon: 'sun' },
    { id: 'dark', label: 'Dark', icon: 'moon' },
    { id: 'system', label: 'System', icon: 'monitor' },
  ];
  protected readonly scales: readonly { id: FontScale; label: string }[] = [
    { id: 'sm', label: 'Small' },
    { id: 'md', label: 'Default' },
    { id: 'lg', label: 'Large' },
  ];
}
