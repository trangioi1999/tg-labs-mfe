import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

/** Accessible on/off toggle (`role="switch"`). */
@Component({
  selector: 'tg-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="label()"
      [disabled]="disabled()"
      (click)="checkedChange.emit(!checked())"
      class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
      [class]="checked() ? 'bg-accent-600' : 'bg-zinc-300 dark:bg-zinc-700'"
    >
      <span
        class="inline-block size-5 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform motion-reduce:transition-none"
        [class]="checked() ? 'translate-x-5.5' : 'translate-x-0.5'"
      ></span>
    </button>
  `,
})
export class Switch {
  readonly checked = input(false);
  readonly disabled = input(false);
  readonly label = input.required<string>();
  readonly checkedChange = output<boolean>();
}
