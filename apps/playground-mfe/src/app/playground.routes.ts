import type { Routes } from '@angular/router';
import { PlaygroundHome } from './features/playground-home/playground-home';
import { PlaygroundLayout } from './playground-layout';

/** Public route contract of the Playground remote, exposed as `./routes`. */
export const routes: Routes = [
  {
    path: '',
    component: PlaygroundLayout,
    children: [
      { path: '', component: PlaygroundHome, title: 'Playground' },
      {
        path: 'signals-lab',
        title: 'Signals Lab',
        loadComponent: () =>
          import('./features/signals-lab/signals-lab').then((m) => m.SignalsLab),
      },
    ],
  },
];
