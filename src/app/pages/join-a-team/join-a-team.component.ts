import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { GoogleLoginProvider, SocialAuthService, SocialAuthServiceConfig, SocialUser } from '@abacritt/angularx-social-login';

import { LabelComponent } from '../../shared/components/label/label.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-join-a-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LabelComponent, ButtonComponent],
  templateUrl: './join-a-team.component.html',
  styleUrls: ['./join-a-team.component.scss']
})
export class JoinATeamComponent {

  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authService = inject(SocialAuthService);

  authState$ = this._authService.authState;
  user!: SocialUser;
  loggedIn!: boolean;

  joinTeamForm: FormGroup = this._formBuilder.group({
    username: ['', Validators.required],
    teamCode: ['', Validators.required]
  });

  ngOnInit() {
    this._authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user !== null);
    });
  }

  onSubmit(): void {
    if (this.joinTeamForm.valid) {
      this._router.navigate(['/ranking'], { queryParams: { teamCode: this.joinTeamForm.get('teamCode')?.value } });
    }
  }

}
