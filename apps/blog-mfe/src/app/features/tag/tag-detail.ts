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
  selector: 'tg-tag-detail',
  imports: [RouterLink, Button, PageHeader, StateMessage, ArticleTeasers],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header eyebrow="Tag" [heading]="'#' + tag()" />
    @if (articles().length) {
      <tg-article-teasers [articles]="articles()" />
    } @else {
      <tg-state-message class="mt-8" heading="No articles with this tag">
        <a tgButton variant="secondary" [routerLink]="indexLink">All tags</a>
      </tg-state-message>
    }
  `,
})
export class TagDetail {
  private readonly store = inject(ArticleStore);
  protected readonly tag = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('tag') ?? '')),
    { requireSync: true },
  );
  protected readonly articles = computed(() => this.store.byTag(this.tag()));
  protected readonly indexLink = remoteLink('blog', 'tags');
}
