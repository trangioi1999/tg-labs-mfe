import {
  ChangeDetectionStrategy,
  Component,
  VERSION,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { REMOTES, SITE, remoteLink } from '@tg-labs/shared-config';
import { Container } from '@tg-labs/shared-layout';
import { Badge, Button, Card } from '@tg-labs/shared-ui';
import { formatDate } from '@tg-labs/shared-utils';
import { RemoteRegistry } from '../../core/federation/remote-registry';
import { SiteNav } from '../../core/navigation/site-nav';
import {
  type HomeBlock,
  PreferencesService,
} from '../../core/preferences/preferences';
import { Icon, SECTION_ICONS } from '../../shared/icon';
import { FEATURED_ARTICLES, RESOURCES, TOPICS } from './home.content';

@Component({
  selector: 'tg-home',
  imports: [RouterLink, Container, Badge, Button, Card, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
})
export class Home {
  private readonly registry = inject(RemoteRegistry);
  private readonly prefs = inject(PreferencesService);
  protected readonly siteNav = inject(SiteNav);

  protected readonly site = SITE;
  protected readonly remotes = this.registry.enabled;
  protected readonly icons = SECTION_ICONS;
  protected readonly blogVisible = computed(() =>
    this.siteNav.isVisible(REMOTES.blog.name),
  );
  protected readonly toolsVisible = computed(() =>
    this.siteNav.isVisible(REMOTES.tools.name),
  );
  protected readonly featured = FEATURED_ARTICLES;
  protected readonly topics = TOPICS;
  protected readonly resources = computed(() =>
    RESOURCES.filter((resource) => this.siteNav.isPathVisible(resource.path)),
  );
  protected readonly stats = [
    { value: `${this.registry.enabled.length}`, label: 'micro frontends live' },
    { value: `v${VERSION.major}`, label: 'Angular, zoneless' },
    { value: '0', label: 'full page reloads' },
    { value: '100%', label: 'tools run in your browser' },
  ];
  protected readonly formatDate = formatDate;

  protected show(block: HomeBlock): boolean {
    return this.prefs.isBlockVisible(block);
  }

  protected articleLink(slug: string): string {
    return remoteLink('blog', slug);
  }

  protected categoryLink(slug: string): string {
    return remoteLink('blog', 'category', slug);
  }
}
