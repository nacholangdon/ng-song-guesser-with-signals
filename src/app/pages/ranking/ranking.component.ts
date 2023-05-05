import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { map, Observable, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsersService } from 'src/app/core/services/users.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { FeedbackWordComponent } from 'src/app/shared/components/feedback-word/feedback-word.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FeedbackWordComponent],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _userService = inject(UsersService);
  private readonly _authService = inject(AuthService);

  users = toSignal(
    this._userService
      .getUsers()
      .pipe(map((users) => users.sort((a, b) => (a.score > b.score ? -1 : 1))))
  );

  get authState() {
    return this._authService.authState();
  }

  public ngOnInit(): void {
    if (!this.authState) {
      debugger;
      this._router.navigate(['/login']);
    }
  }

  public goToSelectSong($event: boolean): void {
    if ($event) {
      debugger;
      this._router.navigate(['/select-song']);
    }
  }
}
