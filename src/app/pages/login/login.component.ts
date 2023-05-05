import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';

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
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UsersService);

  get authState() {
    return this._authService.authState();
  }

  constructor() {
    effect(() => {
      if (!!this.authState) {
        const { name, email } = this.authState;
        const userData = {
          name,
          email,
        };
        this._userService.createUser(userData);
        this._router.navigate(['/guess-the-song']);
      } else {
        this._router.navigate(['/login']);
      }
    });
  }
}
