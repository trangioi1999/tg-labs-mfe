import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ContainerWidth = 'default' | 'prose' | 'wide';

const WIDTHS: Record<ContainerWidth, string> = {
  default: 'max-w-6xl',
  prose: 'max-w-3xl',
  wide: 'max-w-7xl',
};

/** Centred page container with the site's horizontal rhythm. */
@Component({
  selector: 'tg-container',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
})
export class Container {
  readonly width = input<ContainerWidth>('default');

  protected readonly classes = computed(
    () => `mx-auto block w-full px-4 sm:px-6 lg:px-8 ${WIDTHS[this.width()]}`,
  );
}
