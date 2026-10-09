import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { DocsStore } from './data-access/docs-store';
import { DocsLayout } from './docs-layout';
import { DocViewer } from './features/doc-viewer/doc-viewer';
import { DocsHome } from './features/docs-home/docs-home';
import { DocsSearch } from './features/search/docs-search';

const pageTitle = (route: ActivatedRouteSnapshot): string =>
  inject(DocsStore).page(route.paramMap.get('slug') ?? '')?.title ?? 'Page not found';

/** Public route contract of the Docs remote, exposed as `./routes`. */
export const routes: Routes = [
  {
    path: '',
    component: DocsLayout,
    children: [
      { path: '', component: DocsHome, title: 'Docs' },
      { path: 'search', component: DocsSearch, title: 'Search docs' },
      { path: ':slug', component: DocViewer, title: pageTitle },
    ],
  },
];
