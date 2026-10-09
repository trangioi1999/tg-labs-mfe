import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageHeader } from '@tg-labs/shared-ui';
import { ArticleStore } from '../../data-access/article-store';
import { ArticleTeasers } from '../../ui/article-teasers';

@Component({
  selector: 'tg-article-list',
  imports: [PageHeader, ArticleTeasers],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header
      eyebrow="Blog"
      heading="Latest articles"
      description="Notes from building TG Labs: architecture decisions, framework deep dives and the operational details in between."
    />
    <tg-article-teasers [articles]="articles" />
  `,
})
export class ArticleList {
  protected readonly articles = inject(ArticleStore).all();
}
