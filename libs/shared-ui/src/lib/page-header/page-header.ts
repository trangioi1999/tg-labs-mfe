import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Consistent title block for top-level pages inside every section. */
@Component({
  selector: 'tg-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block border-b border-zinc-200 pb-8 dark:border-zinc-800' },
  template: `
    @if (eyebrow()) {
      <p
        class="font-mono text-xs font-medium tracking-widest text-accent-700 uppercase dark:text-accent-400"
      >
        {{ eyebrow() }}
      </p>
    }
    <h1
      class="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white"
    >
      {{ heading() }}
    </h1>
    @if (description()) {
      <p
        class="mt-3 max-w-prose text-base leading-7 text-zinc-600 dark:text-zinc-400"
      >
        {{ description() }}
      </p>
    }
    <ng-content />
  `,
})
export class PageHeader {
  readonly heading = input.required<string>();
  readonly eyebrow = input<string>();
  readonly description = input<string>();
}
