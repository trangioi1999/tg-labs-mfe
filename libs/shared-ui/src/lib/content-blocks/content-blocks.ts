import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ContentBlock } from '@tg-labs/shared-models';

/**
 * Renders the shared `ContentBlock[]` rich-text model with consistent
 * editorial typography. Content is rendered through Angular interpolation, so
 * it is always escaped (no `innerHTML`).
 */
@Component({
  selector: 'tg-content-blocks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block max-w-prose text-base leading-7 text-zinc-700 dark:text-zinc-300',
  },
  template: `
    @for (block of blocks(); track $index) {
      @switch (block.kind) {
        @case ('heading') {
          @if (block.level === 2) {
            <h2
              class="mt-10 mb-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white"
            >
              {{ block.text }}
            </h2>
          } @else {
            <h3
              class="mt-8 mb-2 text-lg font-semibold text-zinc-950 dark:text-white"
            >
              {{ block.text }}
            </h3>
          }
        }
        @case ('paragraph') {
          <p class="my-4">{{ block.text }}</p>
        }
        @case ('list') {
          @if (block.ordered) {
            <ol class="my-4 list-decimal space-y-1 pl-6 marker:text-zinc-400">
              @for (item of block.items; track $index) {
                <li>{{ item }}</li>
              }
            </ol>
          } @else {
            <ul class="my-4 list-disc space-y-1 pl-6 marker:text-zinc-400">
              @for (item of block.items; track $index) {
                <li>{{ item }}</li>
              }
            </ul>
          }
        }
        @case ('code') {
          <figure
            class="my-6 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 dark:border-zinc-800"
          >
            @if (block.language) {
              <figcaption
                class="border-b border-zinc-800 px-4 py-2 font-mono text-xs text-zinc-400"
              >
                {{ block.language }}
              </figcaption>
            }
            <pre
              class="overflow-x-auto p-4 text-sm leading-6 text-zinc-100"
            ><code>{{ block.code }}</code></pre>
          </figure>
        }
        @case ('callout') {
          <aside
            class="my-6 rounded-r-md border-l-4 px-4 py-3 text-sm leading-6"
            [class]="
              block.tone === 'warning'
                ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'
                : 'border-accent-600 bg-accent-50 text-accent-950 dark:bg-accent-950/40 dark:text-accent-100'
            "
          >
            {{ block.text }}
          </aside>
        }
      }
    }
  `,
})
export class ContentBlocks {
  readonly blocks = input.required<readonly ContentBlock[]>();
}
