import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

import { AuthService } from 'src/app/core/services/auth.service';
import { LabelComponent } from '../../shared/components/label/label.component';

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

  private readonly _authState$ = this._authService.authState$;

  ngOnInit(): void {
    this._authState$.subscribe(res => {
      if (!!res) {
        this._router.navigate(['/guess-the-song']);
      }
    });
  }

}
