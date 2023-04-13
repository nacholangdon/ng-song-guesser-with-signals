import { Injectable, inject } from '@angular/core';
import { CanLoad, Route } from '@angular/router';

import { Observable, tap } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanLoad {

  private readonly _authService = inject(AuthService);

  canLoad(route: Route): Observable<boolean> {

    return this._authService.isLoggedIn$.pipe(
        tap((isLoggedIn: boolean) => {
          if (!isLoggedIn) {
            return false;
          }
          return true;
        }));
  }

}
