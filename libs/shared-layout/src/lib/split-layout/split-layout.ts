import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Two-column layout: a sticky secondary navigation column (projected via
 * `[tgAside]`) and the main content. Collapses to a single column on small
 * screens, with the aside rendered first.
 */
@Component({
  selector: 'tg-split-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]' },
  template: `
    <aside class="lg:sticky lg:top-24 lg:self-start" [attr.aria-label]="asideLabel()">
      <ng-content select="[tgAside]" />
    </aside>
    <div class="min-w-0">
      <ng-content />
    </div>
  `,
})
export class SplitLayout {
  readonly asideLabel = input('Section navigation');
}
