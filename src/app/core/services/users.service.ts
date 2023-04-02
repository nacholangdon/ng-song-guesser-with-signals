import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { USER_MOCK } from '../../../mocks/user-mock';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  getUsers(): Observable<User[]> {
    return of(USER_MOCK);
  }

  getUsersByTeamCode(teamCode: string): Observable<User[]> {
    return of(USER_MOCK).pipe(
      map(users => users.filter(user => user.teamCode === teamCode))
    );
  }
}
