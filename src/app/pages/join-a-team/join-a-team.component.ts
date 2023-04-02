import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  joinTeamForm: FormGroup = this._formBuilder.group({
    username: ['', Validators.required],
    teamCode: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.joinTeamForm.valid) {
      console.log(this.joinTeamForm.value);
      this._router.navigate(['/ranking']);
    }
  }

}
