import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { RemoteDefinition } from '@tg-labs/shared-config';
import { Container } from '@tg-labs/shared-layout';
import { Button, StateMessage } from '@tg-labs/shared-ui';

/**
 * Rendered in place of a remote section whose code could not be loaded.
 * Retrying performs a full reload because the router caches the fallback
 * route configuration for the rest of the session.
 */
@Component({
  selector: 'tg-remote-unavailable',
  imports: [RouterLink, Container, Button, StateMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-container class="py-16">
      <tg-state-message
        kind="error"
        [heading]="label + ' is temporarily unavailable'"
        message="This section is deployed independently and could not be loaded right now. The rest of the site keeps working."
      >
        <button tgButton type="button" (click)="retry()">Try again</button>
        <a tgButton variant="secondary" routerLink="/">Back to home</a>
      </tg-state-message>
    </tg-container>
  `,
})
export class RemoteUnavailable {
  private readonly location = inject(DOCUMENT).location;
  private readonly remote = inject(ActivatedRoute).snapshot.data['remote'] as
    | RemoteDefinition
    | undefined;

  protected readonly label = this.remote?.label ?? 'This section';

  protected retry(): void {
    this.location.reload();
  }
}
