import { toSignal } from '@angular/core/rxjs-interop';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { tap } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

import { Team } from '../models/team';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _router = inject(Router);
  private readonly _socialAuthService = inject(SocialAuthService);

  private _isLoggedIn = signal<boolean>(false);
  public isLoggedIn = computed(this._isLoggedIn);

  private _selectedTeam = signal<Team>({} as Team);
  public selectedTeam = computed(this._selectedTeam);

  private _authState = toSignal<SocialUser>(
    this._socialAuthService.authState.pipe(
      tap((socialUser: SocialUser) => {
        this._isLoggedIn.set(!!socialUser);
        if (!socialUser) {
          this._router.navigate(['/login']);
        }
      })
    )
  );
  public authState = computed(this._authState);

  signOut(): void {
    this._socialAuthService.signOut();
  }

  setTeam(team: Team) {
    this._selectedTeam.set(team);
  }
}
