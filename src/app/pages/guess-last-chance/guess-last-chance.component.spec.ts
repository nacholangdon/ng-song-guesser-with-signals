import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessLastChanceComponent } from './guess-last-chance.component';

describe('GuessLastChanceComponent', () => {
  let component: GuessLastChanceComponent;
  let fixture: ComponentFixture<GuessLastChanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GuessLastChanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessLastChanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
