import { Injectable, inject } from '@angular/core';

import { BehaviorSubject, tap } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _socialAuthService = inject(SocialAuthService);

  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  private _selectedTeam: BehaviorSubject<Team> = new BehaviorSubject({} as Team);
  public selectedTeam$ = this._selectedTeam.asObservable();

  public authState$ = this._socialAuthService.authState.pipe(
    tap((socialUser: SocialUser) => {
      this._isLoggedIn.next(!!socialUser);
    })
  );

  signOut(): void {
    this._socialAuthService.signOut();
  }

  setTeam(team: Team) {
    this._selectedTeam.next(team);
  }
}
