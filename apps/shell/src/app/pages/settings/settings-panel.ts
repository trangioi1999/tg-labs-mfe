import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A titled block inside a settings page. */
@Component({
  selector: 'tg-settings-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950',
  },
  template: `
    <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold text-zinc-950 dark:text-white">
          {{ heading() }}
        </h2>
        @if (description()) {
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {{ description() }}
          </p>
        }
      </div>
      <ng-content select="[panel-action]" />
    </div>
    <ng-content />
  `,
})
export class SettingsPanel {
  readonly heading = input.required<string>();
  readonly description = input<string>();
}
