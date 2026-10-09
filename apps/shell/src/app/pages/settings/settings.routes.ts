import type { Routes } from '@angular/router';
import { SettingsLayout } from './settings-layout';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsLayout,
    children: [
      {
        path: '',
        title: 'Dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'appearance',
        title: 'Appearance',
        loadComponent: () =>
          import('./appearance/appearance').then((m) => m.Appearance),
      },
      {
        path: 'sections',
        title: 'Sections',
        loadComponent: () =>
          import('./sections/sections').then((m) => m.Sections),
      },
    ],
  },
];
