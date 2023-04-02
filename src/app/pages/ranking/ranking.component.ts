import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { map, Observable, of } from 'rxjs';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  private readonly _router = inject(ActivatedRoute);
  private readonly _userService = inject(UsersService);
  users$: Observable<User[]> = of([]);
  teamCode = '';

  ngOnInit(): void {
    const teamCode = this._router.snapshot.queryParams['teamCode'];

    this.teamCode = teamCode;
    this.users$ = this._userService.getUsersByTeamCode(teamCode).pipe(
      map(users => users.sort((a, b) => a.score > b.score ? -1 : 1))
    );
  }
}
