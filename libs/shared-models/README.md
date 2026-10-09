# shared-models

Framework-independent TypeScript contracts (DTOs, API envelopes, navigation
types) shared by the Shell, the Remotes and — later — the BFF.

Rules:

- Types only (no runtime code, no Angular imports).
- No domain _logic_; Blog/Docs/Tools behaviour stays in the owning Remote.
