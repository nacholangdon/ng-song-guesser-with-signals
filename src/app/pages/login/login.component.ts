import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

import { AuthService } from 'src/app/core/services/auth.service';
import { LabelComponent } from '../../shared/components/label/label.component';
import { UsersService } from 'src/app/core/services/users.service';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LabelComponent, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UsersService);

  private readonly _authState$ = this._authService.authState$;

  ngOnInit(): void {
    this._authState$
      .pipe(
        tap(res => {
          if (!res) {
            this._router.navigate(['/login']);
          }
        }),
        filter(res => !!res),
        switchMap(res => {
          const { name, email } = res;
          const userData = {
            name,
            email
          };
          return this._userService.createUser(userData);
        })
      )
      .subscribe((res: any) => {
        this._router.navigate(['/guess-the-song']);
      });
  }

}
