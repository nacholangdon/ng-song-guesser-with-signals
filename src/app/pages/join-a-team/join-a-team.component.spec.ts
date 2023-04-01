import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinATeamComponent } from './join-a-team.component';

describe('JoinATeamComponent', () => {
  let component: JoinATeamComponent;
  let fixture: ComponentFixture<JoinATeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ JoinATeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinATeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
