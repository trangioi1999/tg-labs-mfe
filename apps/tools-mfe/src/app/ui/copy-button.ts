import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { Button } from '@tg-labs/shared-ui';

/** Copies text to the clipboard and announces the result to screen readers. */
@Component({
  selector: 'tg-copy-button',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      tgButton
      type="button"
      variant="secondary"
      size="sm"
      [disabled]="!text()"
      (click)="copy()"
    >
      {{
        status() === 'copied'
          ? 'Copied'
          : status() === 'failed'
            ? 'Copy failed'
            : label()
      }}
    </button>
    <span class="sr-only" aria-live="polite">{{
      status() === 'copied' ? 'Copied to clipboard' : ''
    }}</span>
  `,
})
export class CopyButton {
  readonly text = input.required<string>();
  readonly label = input('Copy');
  protected readonly status = signal<'idle' | 'copied' | 'failed'>('idle');

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.text());
      this.status.set('copied');
    } catch {
      this.status.set('failed');
    }
    setTimeout(() => this.status.set('idle'), 1500);
  }
}
