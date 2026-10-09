import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { type RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SITE } from '@tg-labs/shared-config';

/** Formats document titles as "Page · TG Labs" for Shell and Remote routes. */
@Injectable()
export class SiteTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(
      pageTitle
        ? `${pageTitle} · ${SITE.name}`
        : `${SITE.name} — ${SITE.tagline}`,
    );
  }
}
