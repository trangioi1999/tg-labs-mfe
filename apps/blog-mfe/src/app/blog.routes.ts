import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { ArticleStore } from './data-access/article-store';
import { BlogLayout } from './blog-layout';
import { ArticleDetail } from './features/article-detail/article-detail';
import { ArticleList } from './features/article-list/article-list';
import { CategoryDetail } from './features/category/category-detail';
import { CategoryIndex } from './features/category/category-index';
import { Search } from './features/search/search';
import { TagDetail } from './features/tag/tag-detail';
import { TagIndex } from './features/tag/tag-index';

const articleTitle = (route: ActivatedRouteSnapshot): string =>
  inject(ArticleStore).bySlug(route.paramMap.get('slug') ?? '')?.title ??
  'Article not found';

/**
 * Public route contract of the Blog remote, exposed via Native Federation as
 * `./routes`. Paths are relative to the mount point chosen by the host
 * (`/blog` in the Shell).
 */
export const routes: Routes = [
  {
    path: '',
    component: BlogLayout,
    children: [
      { path: '', component: ArticleList, title: 'Blog' },
      { path: 'categories', component: CategoryIndex, title: 'Categories' },
      { path: 'category/:slug', component: CategoryDetail, title: 'Category' },
      { path: 'tags', component: TagIndex, title: 'Tags' },
      { path: 'tag/:tag', component: TagDetail, title: 'Tag' },
      { path: 'search', component: Search, title: 'Search' },
      { path: ':slug', component: ArticleDetail, title: articleTitle },
    ],
  },
];
