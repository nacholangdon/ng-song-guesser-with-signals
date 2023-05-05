import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { User } from '../models/user';
import { Constants } from '../models/constant';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    return this._http.get<User[]>(`${Constants.API_URL}/player/score`, {
      headers,
    });
  }

  createUser(userData: { email: string; name: string }): any {
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
    );
  }

  updateUserScore(scoreObj: {
    email: string;
    name: string;
    playedGames?: number;
    score: number;
  }): Observable<User> {
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    const { email, name, score } = scoreObj;
    console.log(scoreObj);
    const response = this._http.put<any>(
      `${Constants.API_URL}/player/score`,
      { name, email, score },
      { headers }
    );
    response.subscribe(
      (user) => {
        console.log('Actualización exitosa:', user);
      },
      (error) => {
        console.error('Error al actualizar:', error);
      }
    );
    return response;
  }
}
