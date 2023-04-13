import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Observable, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { Team } from 'src/app/core/models/team';
import { AuthService } from 'src/app/core/services/auth.service';
import { TeamsService } from 'src/app/core/services/teams.service';
import { LabelComponent } from '../../shared/components/label/label.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-join-a-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LabelComponent, ButtonComponent],
  templateUrl: './join-a-team.component.html',
  styleUrls: ['./join-a-team.component.scss']
})
export class JoinATeamComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _teamsService = inject(TeamsService);

  authState$ = this._authService.authState$;
  isLoggedIn$ = this._authService.isLoggedIn$;

  searchTeam = new FormControl('');

  public teams$: Observable<Team[]> = this.searchTeam.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((term) => term ? this.getTeams(term) : of([]))
  );

  ngOnInit(): void {
    this.authState$.subscribe(res => {
      if (!res) {
        this._router.navigate(['/login']);
      }
    });
  }

  public selectTeam(team: Team): void {
    this._authService.setTeam(team);
    this._router.navigate(['/guess-the-song']);
  }

  public getTeams(name: string): Observable<Team[]> {
    return this._teamsService.getTeams().pipe(
      map((response: Team[]) => response.filter((team: Team) => team.name.toLowerCase().includes(name.toLowerCase()))
    ));
  }

}
