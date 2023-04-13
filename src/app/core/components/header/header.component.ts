import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { AuthService } from '../../services/auth.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  private readonly _authService = inject(AuthService);

  public vm$ = combineLatest([
    this._authService.authState$,
    this._authService.isLoggedIn$,
    this._authService.selectedTeam$
  ]).pipe(map(([authState, isLoggedIn, selectedTeam]) => ({ authState, isLoggedIn, selectedTeam })));

  public signOut(): void {
    this._authService.signOut();
  }
}
