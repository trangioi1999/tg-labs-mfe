import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { Badge, PageHeader } from '@tg-labs/shared-ui';
import { claimDate, decodeJwt, expiryState } from './jwt-decode';

const EXPIRY_LABELS = {
  expired: 'Expired (exp is in the past)',
  valid: 'Not expired (exp is in the future)',
  'not-yet-valid': 'Not yet valid (nbf is in the future)',
  unknown: 'No exp claim',
} as const;

@Component({
  selector: 'tg-jwt-decoder',
  imports: [Badge, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tg-page-header
      eyebrow="Tool"
      heading="JWT Decoder"
      description="Inspect the header and payload of a JSON Web Token."
    />

    <aside
      role="note"
      class="mt-6 rounded-md border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
    >
      <strong>Decode only.</strong> This tool does not verify signatures, so it
      cannot tell you whether a token is authentic or untampered. Never trust
      decoded claims without server-side verification, and avoid pasting
      production tokens into any website.
    </aside>

    <label
      for="jwt-input"
      class="mt-6 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >Encoded token</label
    >
    <textarea
      id="jwt-input"
      #jwtInput
      spellcheck="false"
      autocomplete="off"
      placeholder="eyJhbGciOi..."
      class="mt-2 h-32 w-full resize-y rounded-md border border-zinc-300 bg-white p-3 font-mono text-sm break-all focus:border-accent-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
      [value]="input()"
      (input)="input.set(jwtInput.value)"
    ></textarea>

    <div class="mt-6" aria-live="polite">
      @let res = result();
      @if (!input().trim()) {
        <p class="text-sm text-zinc-500">Paste a token to see its contents.</p>
      } @else if (!res.ok) {
        <p
          role="alert"
          class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
        >
          {{ res.message }}
        </p>
      } @else {
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <tg-badge tone="accent"
            >alg: {{ res.token.header['alg'] ?? 'n/a' }}</tg-badge
          >
          <tg-badge>{{ expiryLabel() }}</tg-badge>
          <tg-badge>signature: not verified</tg-badge>
        </div>
        <div class="mt-4 grid gap-4 lg:grid-cols-2">
          <section aria-labelledby="jwt-header-title">
            <h2
              id="jwt-header-title"
              class="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Header
            </h2>
            <pre
              class="mt-2 overflow-x-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-950"
              >{{ pretty(res.token.header) }}</pre
            >
          </section>
          <section aria-labelledby="jwt-payload-title">
            <h2
              id="jwt-payload-title"
              class="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Payload
            </h2>
            <pre
              class="mt-2 overflow-x-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-950"
              >{{ pretty(res.token.payload) }}</pre
            >
          </section>
        </div>
        @if (timeClaims().length) {
          <dl
            class="mt-4 grid gap-x-6 gap-y-1 font-mono text-xs text-zinc-600 sm:grid-cols-[auto_1fr] dark:text-zinc-400"
          >
            @for (claim of timeClaims(); track claim.name) {
              <dt class="font-semibold">{{ claim.name }}</dt>
              <dd>{{ claim.value }}</dd>
            }
          </dl>
        }
      }
    </div>
  `,
})
export class JwtDecoder {
  protected readonly input = signal('');
  protected readonly result = computed(() => decodeJwt(this.input()));

  protected readonly expiryLabel = computed(() => {
    const result = this.result();
    return result.ok ? EXPIRY_LABELS[expiryState(result.token.payload)] : '';
  });

  protected readonly timeClaims = computed(() => {
    const result = this.result();
    if (!result.ok) {
      return [];
    }
    return (['iat', 'nbf', 'exp'] as const).flatMap((name) => {
      const value = claimDate(result.token.payload[name]);
      return value ? [{ name, value }] : [];
    });
  });

  protected pretty(value: unknown): string {
    return JSON.stringify(value, null, 2);
  }
}
