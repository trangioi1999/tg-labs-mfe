import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { Button, PageHeader } from '@tg-labs/shared-ui';

const MAX_LOG_ENTRIES = 6;

/**
 * Demo: a tiny reactive graph. `count` and `step` are writable signals,
 * `doubled`/`parity` are computed, and an effect records every change.
 */
@Component({
  selector: 'tg-signals-lab',
  imports: [RouterLink, Button, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [routerLink]="backLink" class="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">← All experiments</a>
    <tg-page-header class="mt-4" eyebrow="Experiment" heading="Signals Lab" description="Change the source signals and watch derived values and the effect log update." />

    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <section aria-labelledby="sources-title" class="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 id="sources-title" class="font-mono text-xs tracking-widest text-zinc-500 uppercase">Writable signals</h2>
        <p class="mt-4 font-mono text-sm">count = <output class="text-2xl font-semibold text-zinc-950 dark:text-white" aria-live="polite">{{ count() }}</output></p>
        <div class="mt-4 flex flex-wrap gap-2">
          <button tgButton type="button" variant="secondary" (click)="decrement()">− {{ step() }}</button>
          <button tgButton type="button" (click)="increment()">+ {{ step() }}</button>
          <button tgButton type="button" variant="ghost" (click)="reset()">Reset</button>
        </div>
        <label class="mt-6 block text-sm text-zinc-700 dark:text-zinc-300">
          step = <span class="font-mono">{{ step() }}</span>
          <input #stepInput type="range" min="1" max="10" class="mt-2 block w-full accent-accent-600" [value]="step()" (input)="step.set(stepInput.valueAsNumber)" />
        </label>
      </section>

      <section aria-labelledby="derived-title" class="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 id="derived-title" class="font-mono text-xs tracking-widest text-zinc-500 uppercase">Computed signals</h2>
        <dl class="mt-4 space-y-2 font-mono text-sm">
          <div class="flex justify-between gap-4"><dt class="text-zinc-500">doubled = count × 2</dt><dd class="font-semibold text-zinc-950 dark:text-white">{{ doubled() }}</dd></div>
          <div class="flex justify-between gap-4"><dt class="text-zinc-500">parity</dt><dd class="font-semibold text-zinc-950 dark:text-white">{{ parity() }}</dd></div>
        </dl>
        <h2 class="mt-6 font-mono text-xs tracking-widest text-zinc-500 uppercase">effect() log</h2>
        <ol class="mt-3 space-y-1 font-mono text-xs text-zinc-600 dark:text-zinc-400" aria-label="Effect log">
          @for (entry of log(); track entry.id) {
            <li>#{{ entry.id }} count={{ entry.count }} step={{ entry.step }}</li>
          } @empty {
            <li>No runs yet.</li>
          }
        </ol>
      </section>
    </div>
  `,
})
export class SignalsLab {
  protected readonly count = signal(0);
  protected readonly step = signal(1);
  protected readonly doubled = computed(() => this.count() * 2);
  protected readonly parity = computed(() => (this.count() % 2 === 0 ? 'even' : 'odd'));
  protected readonly log = signal<readonly { id: number; count: number; step: number }[]>([]);
  protected readonly backLink = remoteLink('playground');

  private runs = 0;

  constructor() {
    effect(() => {
      const entry = { id: ++this.runs, count: this.count(), step: this.step() };
      untracked(() => this.log.update((log) => [entry, ...log].slice(0, MAX_LOG_ENTRIES)));
    });
  }

  protected increment(): void {
    this.count.update((value) => value + this.step());
  }

  protected decrement(): void {
    this.count.update((value) => value - this.step());
  }

  protected reset(): void {
    this.count.set(0);
    this.step.set(1);
  }
}
