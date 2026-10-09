import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Container } from '@tg-labs/shared-layout';

/** Root component of the Playground remote (carries the remote's stylesheet). */
@Component({
  selector: 'tg-playground-layout',
  imports: [RouterOutlet, Container],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './playground-layout.css',
  template: `
    <tg-container class="py-10 sm:py-14">
      <router-outlet />
    </tg-container>
  `,
})
export class PlaygroundLayout {}
