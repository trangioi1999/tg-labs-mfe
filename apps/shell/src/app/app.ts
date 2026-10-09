import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Container } from '@tg-labs/shared-layout';
import { StateMessage } from '@tg-labs/shared-ui';
import { NavigationState } from './core/navigation/navigation-state';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';

@Component({
  selector: 'tg-root',
  imports: [RouterOutlet, Header, Footer, Container, StateMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-dvh flex-col' },
  template: `
    <a
      href="#main"
      class="sr-only z-50 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >Skip to content</a
    >
    <tg-header />
    <main
      id="main"
      tabindex="-1"
      class="flex-1 focus:outline-none"
      [attr.aria-busy]="navState.navigating()"
    >
      @if (navState.loadingSection(); as section) {
        <tg-container class="py-16">
          <tg-state-message
            kind="loading"
            [heading]="'Loading ' + section + '…'"
            message="Fetching this section of the site."
          />
        </tg-container>
      }
      <div [hidden]="navState.loadingSection() !== null">
        <router-outlet />
      </div>
    </main>
    <tg-footer />
  `,
})
export class App {
  protected readonly navState = inject(NavigationState);
}
