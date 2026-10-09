import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StateKind = 'empty' | 'error' | 'loading';

/**
 * Shared presentation for empty, loading and error states. Projected content
 * (e.g. a retry button) is rendered below the message.
 */
@Component({
  selector: 'tg-state-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'flex flex-col items-center rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-zinc-700',
    '[attr.role]': "kind() === 'error' ? 'alert' : 'status'",
    '[attr.aria-busy]': "kind() === 'loading'",
  },
  template: `
    @switch (kind()) {
      @case ('loading') {
        <span
          class="size-6 animate-spin rounded-full border-2 border-zinc-300 border-t-accent-600 motion-reduce:animate-none dark:border-zinc-700 dark:border-t-accent-400"
          aria-hidden="true"
        ></span>
      }
      @case ('error') {
        <span
          class="font-mono text-sm font-semibold text-red-700 dark:text-red-400"
          aria-hidden="true"
          >ERR</span
        >
      }
      @default {
        <span
          class="font-mono text-sm font-semibold text-zinc-400"
          aria-hidden="true"
          >∅</span
        >
      }
    }
    <p class="mt-4 font-semibold text-zinc-900 dark:text-zinc-100">
      {{ heading() }}
    </p>
    @if (message()) {
      <p
        class="mt-1 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400"
      >
        {{ message() }}
      </p>
    }
    <div class="mt-5 flex flex-wrap justify-center gap-3 empty:hidden">
      <ng-content />
    </div>
  `,
})
export class StateMessage {
  readonly kind = input<StateKind>('empty');
  readonly heading = input.required<string>();
  readonly message = input<string>();
}
