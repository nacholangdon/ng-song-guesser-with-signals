import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'join-a-team'
  },
  {
    path: 'join-a-team',
    loadComponent: () => import('./app/pages/join-a-team/join-a-team.component').then(c => c.JoinATeamComponent),
  },
  {
    path: 'ranking',
    loadComponent: () => import('./app/pages/ranking/ranking.component').then(c => c.RankingComponent),
  },
  {
    path: 'select-song',
    loadComponent: () => import('./app/pages/select-song/select-song.component').then(c => c.SelectSongComponent),
  },
  {
    path: 'guess-the-song',
    loadComponent: () => import('./app/pages/guess-the-song/guess-the-song.component').then(c => c.GuessTheSongComponent),
  },
  {
    path: 'guess-last-chance',
    loadComponent: () => import('./app/pages/guess-last-chance/guess-last-chance.component').then(c => c.GuessLastChanceComponent),
  }
];
