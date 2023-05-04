import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard  {

  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._authService.isLoggedIn$.pipe(
      map((response: boolean) => {
        if (response) {
          return true;
        }
        this._router.navigate(['/login']);
        return false;
    }), catchError((error) => {
      this._router.navigate(['/login']);
      return of(false);
    }));
}

}
