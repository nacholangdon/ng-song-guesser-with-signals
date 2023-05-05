import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { combineLatest, map } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private readonly _authService = inject(AuthService);

  public vm = toSignal(
    combineLatest([
      this._authService.authState$,
      this._authService.isLoggedIn$,
      this._authService.selectedTeam$,
    ]).pipe(
      map(([authState, isLoggedIn, selectedTeam]) => ({
        authState,
        isLoggedIn,
        selectedTeam,
      }))
    )
  );

  public signOut(): void {
    this._authService.signOut();
  }
}
