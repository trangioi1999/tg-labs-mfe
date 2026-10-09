# shared-ui

Reusable, domain-agnostic Angular UI primitives and the Tailwind design tokens.

| Export            | Selector                              |
| ----------------- | ------------------------------------- |
| `Button`          | `button[tgButton]`, `a[tgButton]`     |
| `Card`            | `tg-card`                             |
| `Badge`           | `tg-badge`                            |
| `PageHeader`      | `tg-page-header`                      |
| `StateMessage`    | `tg-state-message` (empty/error/load) |
| `ContentBlocks`   | `tg-content-blocks`                   |

Styles:

- `src/styles/tokens.css` – Tailwind v4 `@theme` tokens + `dark` variant.
- `src/styles/base.css` – global base layer (only for app-level stylesheets).

Components use Tailwind utility classes; each consuming application's Tailwind
build must include `libs/shared-ui/src` as a `@source`.
