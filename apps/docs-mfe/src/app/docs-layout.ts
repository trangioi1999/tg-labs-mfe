import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Container, SplitLayout } from '@tg-labs/shared-layout';
import { DocsNav } from './navigation/docs-nav';

/** Root component of the Docs remote (carries the remote's stylesheet). */
@Component({
  selector: 'tg-docs-layout',
  imports: [RouterOutlet, Container, SplitLayout, DocsNav],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './docs-layout.css',
  template: `
    <tg-container width="wide" class="py-10 sm:py-14">
      <tg-split-layout asideLabel="Documentation navigation">
        <tg-docs-nav tgAside />
        <router-outlet />
      </tg-split-layout>
    </tg-container>
  `,
})
export class DocsLayout {}
