import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { map, Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsersService } from 'src/app/core/services/users.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _userService = inject(UsersService);
  private readonly _authService = inject(AuthService);

  authState$ = this._authService.authState$;
  users$: Observable<User[]> = of([]);
  teamCode = '';

  public ngOnInit(): void {
    const teamCode = this._route.snapshot.queryParams['teamCode'] || 'teamA1';

    this.teamCode = teamCode;
    this.users$ = this._userService.getUsersByTeamCode(teamCode).pipe(
      map(users => users.sort((a, b) => a.score > b.score ? -1 : 1))
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
