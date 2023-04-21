import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { map, Observable, of, tap } from 'rxjs';

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
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _userService = inject(UsersService);
  private readonly _authService = inject(AuthService);

  authState$ = this._authService.authState$;
  users$: Observable<User[]> = of([]);

  public ngOnInit(): void {
    this.users$ = this._userService.getUsers().pipe(
      map(users => users.sort((a, b) => a.score > b.score ? -1 : 1)),
    );

    this.authState$.subscribe(res => {
      if (!res) {
        this._router.navigate(['/login']);
      }
    });
  }

  public goToSelectSong($event: boolean): void {
    if ($event) {
      this._router.navigate(['/select-song']);
    }
  }
}
