import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    debugger;
    if (this._authService.isLoggedIn()) {
      return of(true);
    } else {
      this._router.navigate(['/login']);
      return of(false);
    }
  }
}
