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
  }

  createUser(userData: {
    email: string,
    name: string
  }): any {
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    const { name, email } = userData;
    return this._http.post<any>(
      `${Constants.API_URL}/player`,
      {
        name,
        email,
        password: 'password',
        score: 0,
      },
      { headers }
    )
  }

  updateUserScore(scoreObj: {
    email: string,
    name: string,
    playedGames?: number,
    score: number
  }): Observable<User> {
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    const { email, name, score } = scoreObj;
    return this._http.put<User>(
      `${Constants.API_URL}/player/score`,
      {
        name,
        email,
        score,
      },
      { headers }
    );
  }
}
