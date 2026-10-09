import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Standalone wrapper for local development of the Playground remote. In
 * production the Shell renders this remote's routes inside its own layout.
 */
@Component({
  selector: 'tg-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center font-mono text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
      playground-mfe · standalone dev mode — open the Shell (http://localhost:4200) for the full site
    </p>
    <router-outlet />
  `,
})
export class App {}
