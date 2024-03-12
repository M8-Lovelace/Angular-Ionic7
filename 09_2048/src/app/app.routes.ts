import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'game',
    loadComponent: () => import('./game/game.page').then((m) => m.GamePage),
  },
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full',
  },
  {
    path: 'game',
    loadComponent: () => import('./game/game.page').then(m => m.GamePage)
  },
];
