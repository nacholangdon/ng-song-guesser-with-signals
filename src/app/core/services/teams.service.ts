import { Injectable } from '@angular/core';

import { Observable, map, of } from 'rxjs';

import { Team } from '../models/team';
import { TEAMS_MOCK } from '../../../mocks/teams-mock';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  getTeams(): Observable<Team[]> {
    return of(TEAMS_MOCK);
  }

  getTeam(name: string): Observable<Team> {
    return of(TEAMS_MOCK).pipe(
      map(teams => {
        debugger;
        return {} as Team;
      })
    );
  }
}
