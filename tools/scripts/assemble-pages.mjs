// Assembles the production builds of the Shell and every Remote into a single
// static site for Cloudflare Pages (or any static host):
//
//   dist/pages/                    <- shell (index.html, bundles, assets)
//   dist/pages/mfe/<remote>/       <- each remote's federation build
//   dist/pages/federation.manifest.json  (same-origin /mfe/<remote>/ URLs)
//   dist/pages/_headers            (Cloudflare Pages cache headers)
//
// This mirrors the Docker gateway layout, so the Shell needs no CORS and the
// remote URLs match the container defaults. Run after the production builds:
//   npx nx run-many -t build -p shell blog-mfe docs-mfe tools-mfe playground-mfe
//   node tools/scripts/assemble-pages.mjs
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const out = join(root, 'dist', 'pages');

// Federation name -> URL segment under /mfe/. Keep in sync with
// libs/shared-config (REMOTES) and infra/nginx/conf.d/gateway.conf.
const remotes = {
  'blog-mfe': 'blog',
  'docs-mfe': 'docs',
  'tools-mfe': 'tools',
  'playground-mfe': 'playground',
};

const browserOutput = (app) => join(root, 'dist', 'apps', app, 'browser');

for (const app of ['shell', ...Object.keys(remotes)]) {
  if (!existsSync(join(browserOutput(app), 'remoteEntry.json'))) {
    console.error(
      `Missing production build for "${app}". Run: npx nx build ${app}`,
    );
    process.exit(1);
  }
}

rmSync(out, { recursive: true, force: true });
cpSync(browserOutput('shell'), out, { recursive: true });

const manifest = {};
for (const [app, segment] of Object.entries(remotes)) {
  cpSync(browserOutput(app), join(out, 'mfe', segment), { recursive: true });
  manifest[app] = `/mfe/${segment}/remoteEntry.json`;
}
writeFileSync(
  join(out, 'federation.manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

// Cloudflare Pages header rules: federation metadata and HTML must always be
// revalidated; every JS/CSS bundle has a content hash and can be cached forever.
writeFileSync(
  join(out, '_headers'),
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN

/*.json
  Cache-Control: no-cache

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable
`,
);

console.log(`Assembled static site in ${out}`);
console.log(manifest);
