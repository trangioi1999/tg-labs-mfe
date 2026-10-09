import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Container } from '@tg-labs/shared-layout';
import { PRIMARY_NAV, SITE } from '@tg-labs/shared-config';
import { NavigationState } from '../../core/navigation/navigation-state';
import { ThemeService } from '../../core/theme/theme';

@Component({
  selector: 'tg-header',
  imports: [RouterLink, RouterLinkActive, Container],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'sticky top-0 z-40 block border-b border-zinc-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-zinc-800 dark:bg-zinc-950/90 dark:supports-[backdrop-filter]:bg-zinc-950/75',
  },
  templateUrl: './header.html',
})
export class Header {
  protected readonly site = SITE;
  protected readonly nav = PRIMARY_NAV;
  protected readonly navState = inject(NavigationState);
  protected readonly theme = inject(ThemeService);
}
