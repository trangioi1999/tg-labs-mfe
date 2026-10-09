import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'accent';

const TONES: Record<BadgeTone, string> = {
  neutral:
    'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300',
  accent:
    'border-accent-200 bg-accent-50 text-accent-800 dark:border-accent-800 dark:bg-accent-950/60 dark:text-accent-200',
};

@Component({
  selector: 'tg-badge',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
})
export class Badge {
  readonly tone = input<BadgeTone>('neutral');

  protected readonly classes = computed(
    () =>
      `inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs ${TONES[this.tone()]}`,
  );
}
