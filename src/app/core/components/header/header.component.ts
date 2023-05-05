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

  get authState() {
    return this._authService.authState();
  }
  get isLoggedIn() {
    return this._authService.isLoggedIn();
  }
  get selectedTeam() {
    return this._authService.selectedTeam();
  }

  public signOut(): void {
    this._authService.signOut();
  }
}
