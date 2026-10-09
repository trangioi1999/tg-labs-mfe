import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE, remoteLink } from '@tg-labs/shared-config';
import { Container } from '@tg-labs/shared-layout';
import { Badge, Button, Card } from '@tg-labs/shared-ui';
import { formatDate } from '@tg-labs/shared-utils';
import { FEATURED_ARTICLES, RESOURCES, TOPICS } from './home.content';

@Component({
  selector: 'tg-home',
  imports: [RouterLink, Container, Badge, Button, Card],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
})
export class Home {
  protected readonly site = SITE;
  protected readonly featured = FEATURED_ARTICLES;
  protected readonly topics = TOPICS;
  protected readonly resources = RESOURCES;
  protected readonly formatDate = formatDate;

  protected articleLink(slug: string): string {
    return remoteLink('blog', slug);
  }

  protected categoryLink(slug: string): string {
    return remoteLink('blog', 'category', slug);
  }
}
