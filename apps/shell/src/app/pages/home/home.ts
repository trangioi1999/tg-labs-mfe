import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { REMOTES, SITE, remoteLink } from '@tg-labs/shared-config';
import { Container } from '@tg-labs/shared-layout';
import { Badge, Button, Card } from '@tg-labs/shared-ui';
import { formatDate } from '@tg-labs/shared-utils';
import { RemoteRegistry } from '../../core/federation/remote-registry';
import { FEATURED_ARTICLES, RESOURCES, TOPICS } from './home.content';

@Component({
  selector: 'tg-home',
  imports: [RouterLink, Container, Badge, Button, Card],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
})
export class Home {
  private readonly registry = inject(RemoteRegistry);

  protected readonly site = SITE;
  protected readonly remotes = this.registry.enabled;
  protected readonly blogEnabled = this.registry.isEnabled(REMOTES.blog.name);
  protected readonly toolsEnabled = this.registry.isEnabled(REMOTES.tools.name);
  protected readonly featured = FEATURED_ARTICLES;
  protected readonly topics = TOPICS;
  protected readonly resources = RESOURCES.filter((resource) =>
    this.registry.isPathEnabled(resource.path),
  );
  protected readonly formatDate = formatDate;

  protected articleLink(slug: string): string {
    return remoteLink('blog', slug);
  }

  protected categoryLink(slug: string): string {
    return remoteLink('blog', 'category', slug);
  }
}
