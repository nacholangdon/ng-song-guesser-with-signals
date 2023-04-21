import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { USER_MOCK } from '../../../mocks/user-mock';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../models/constant';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    return this._http.get<User[]>(`${Constants.API_URL}/player/score`, { headers });
    // return of(USER_MOCK);
  }

  getUsersByTeamCode(teamCode: string): Observable<User[]> {
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    return this._http.get<User[]>(`${Constants.API_URL}/player/score`, { headers });
    // return of(USER_MOCK).pipe(
    //   map(users => users.filter(user => user.teamCode === teamCode))
    // );
  }

  updateUserScore(scoreObj: {
    email: string,
    playedGames?: number,
    score: number
  }): Observable<User> {
    console.log('scoreObj', scoreObj) // TODO: send an http request
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    const { email, score } = scoreObj;
    return this._http.put<User>(
      `${Constants.API_URL}/player/score`,
      {
        email,
        score,
      },
      { headers }
    );
  }
}
