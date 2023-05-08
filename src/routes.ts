import { Routes } from '@angular/router';
import { authenticationGuard } from './app/shared/guards/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./app/pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'join-a-team',
    loadComponent: () =>
      import('./app/pages/join-a-team/join-a-team.component').then(
        (c) => c.JoinATeamComponent
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: 'guess-the-song',
    loadComponent: () =>
      import('./app/pages/guess-the-song/guess-the-song.component').then(
        (c) => c.GuessTheSongComponent
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: 'ranking',
    loadComponent: () =>
      import('./app/pages/ranking/ranking.component').then(
        (c) => c.RankingComponent
      ),
    canActivate: [authenticationGuard],
  },
  { path: '**', redirectTo: 'login' },
];
