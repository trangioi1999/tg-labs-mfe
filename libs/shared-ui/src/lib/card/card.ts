import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

const BASE =
  'relative flex flex-col rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60';
const INTERACTIVE =
  'transition-colors hover:border-zinc-400 focus-within:border-zinc-400 dark:hover:border-zinc-600 dark:focus-within:border-zinc-600';

/** Bordered surface used for article teasers, tool tiles and resources. */
@Component({
  selector: 'tg-card',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
})
export class Card {
  /** Adds a hover affordance; pair with a stretched link inside the card. */
  readonly interactive = input(false);

  protected readonly classes = computed(() =>
    this.interactive() ? `${BASE} ${INTERACTIVE}` : BASE,
  );
}
