import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from 'src/app/core/services/auth.service';
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
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);

  authState$ = this._authService.authState$;
  isLoggedIn$ = this._authService.isLoggedIn$;

  joinTeamForm: FormGroup = this._formBuilder.group({
    teamCode: ['', Validators.required]
  });

  ngOnInit(): void {
    this.authState$.subscribe(res => {
      if (!res) {
        this._router.navigate(['/login']);
      }
    });
  }

  public signOut(): void {
    this._authService.signOut();
  }

}
