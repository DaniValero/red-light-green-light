import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'game',
    loadComponent: () => import('./features/game/game.component').then(m => m.GameComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ranking',
    loadComponent: () => import('./features/ranking/ranking.component').then(m => m.RankingComponent)
  },
  {
    path: '**',
    redirectTo: '',
  },
];
