import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { remoteLink } from '@tg-labs/shared-config';
import { Button, PageHeader, StateMessage } from '@tg-labs/shared-ui';
import { map } from 'rxjs';
import { ArticleStore } from '../../data-access/article-store';
import { ArticleTeasers } from '../../ui/article-teasers';

@Component({
  selector: 'tg-category-detail',
  imports: [RouterLink, Button, PageHeader, StateMessage, ArticleTeasers],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (category(); as category) {
      <tg-page-header
        eyebrow="Category"
        [heading]="category.name"
        [description]="category.description"
      />
      @if (articles().length) {
        <tg-article-teasers [articles]="articles()" />
      } @else {
        <tg-state-message
          class="mt-8"
          heading="No articles yet"
          message="This category is ready for its first post."
        />
      }
    } @else {
      <tg-state-message heading="Category not found">
        <a tgButton variant="secondary" [routerLink]="indexLink"
          >All categories</a
        >
      </tg-state-message>
    }
  `,
})
export class CategoryDetail {
  private readonly store = inject(ArticleStore);
  private readonly slug = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { requireSync: true },
  );

  protected readonly category = computed(() =>
    this.store.category(this.slug()),
  );
  protected readonly articles = computed(() =>
    this.store.byCategory(this.slug()),
  );
  protected readonly indexLink = remoteLink('blog', 'categories');
}
