import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { PageHeader } from '@tg-labs/shared-ui';
import { CopyButton } from '../../ui/copy-button';
import { type CodecResult, decodeBase64, encodeBase64 } from './base64-codec';

type Direction = 'encode' | 'decode';

@Component({
  selector: 'tg-base64-tool',
  imports: [PageHeader, CopyButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header
      eyebrow="Tool"
      heading="Base64 Encoder / Decoder"
      description="Convert UTF-8 text to Base64 and back. URL-safe input is detected automatically when decoding."
    />

    <div class="mt-8 flex flex-wrap items-center gap-4">
      <div
        class="inline-flex rounded-md border border-zinc-300 p-0.5 dark:border-zinc-700"
        role="group"
        aria-label="Direction"
      >
        @for (option of directions; track option) {
          <button
            type="button"
            class="rounded px-3 py-1.5 text-sm font-medium capitalize"
            [class]="
              direction() === option
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-600 dark:text-zinc-400'
            "
            [attr.aria-pressed]="direction() === option"
            (click)="direction.set(option)"
          >
            {{ option }}
          </button>
        }
      </div>
      @if (direction() === 'encode') {
        <label
          class="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
        >
          <input
            #urlSafeBox
            type="checkbox"
            class="size-4 accent-accent-600"
            [checked]="urlSafe()"
            (change)="urlSafe.set(urlSafeBox.checked)"
          />
          URL-safe (Base64URL, no padding)
        </label>
      }
    </div>

    <div class="mt-4 grid gap-4 lg:grid-cols-2">
      <div class="flex flex-col">
        <label
          for="b64-input"
          class="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >{{ direction() === 'encode' ? 'Text' : 'Base64' }}</label
        >
        <textarea
          id="b64-input"
          #b64Input
          spellcheck="false"
          class="mt-2 h-64 resize-y rounded-md border border-zinc-300 bg-white p-3 font-mono text-sm leading-6 focus:border-accent-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
          [value]="input()"
          (input)="input.set(b64Input.value)"
        ></textarea>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center justify-between">
          <label
            for="b64-output"
            class="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >{{ direction() === 'encode' ? 'Base64' : 'Text' }}</label
          >
          <tg-copy-button [text]="output()" />
        </div>
        <textarea
          id="b64-output"
          readonly
          spellcheck="false"
          class="mt-2 h-64 resize-y rounded-md border border-zinc-200 bg-zinc-50 p-3 font-mono text-sm leading-6 dark:border-zinc-800 dark:bg-zinc-950"
          [value]="output()"
        ></textarea>
      </div>
    </div>
    @if (error(); as message) {
      <p
        role="alert"
        class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
      >
        {{ message }}
      </p>
    }
  `,
})
export class Base64Tool {
  protected readonly directions: readonly Direction[] = ['encode', 'decode'];
  protected readonly direction = signal<Direction>('encode');
  protected readonly urlSafe = signal(false);
  protected readonly input = signal('');

  private readonly result = computed<CodecResult>(() =>
    this.direction() === 'encode'
      ? { ok: true, output: encodeBase64(this.input(), this.urlSafe()) }
      : decodeBase64(this.input()),
  );

  protected readonly output = computed(() => {
    const result = this.result();
    return result.ok ? result.output : '';
  });

  protected readonly error = computed(() => {
    const result = this.result();
    return result.ok ? null : result.message;
  });
}
