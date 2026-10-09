import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Container } from '@tg-labs/shared-layout';
import { SITE } from '@tg-labs/shared-config';
import { NavigationState } from '../../core/navigation/navigation-state';
import { SiteNav } from '../../core/navigation/site-nav';
import { PreferencesService } from '../../core/preferences/preferences';
import { Icon, SECTION_ICONS } from '../../shared/icon';

@Component({
  selector: 'tg-header',
  imports: [RouterLink, RouterLinkActive, Container, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'sticky top-0 z-40 block border-b border-zinc-200/80 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-950/80 dark:supports-[backdrop-filter]:bg-zinc-950/70',
  },
  templateUrl: './header.html',
})
export class Header {
  protected readonly site = SITE;
  protected readonly siteNav = inject(SiteNav);
  protected readonly navState = inject(NavigationState);
  protected readonly prefs = inject(PreferencesService);
  protected readonly icons = SECTION_ICONS;

  protected iconFor(path: string) {
    return this.icons[path.slice(1)] ?? 'layers';
  }
}
