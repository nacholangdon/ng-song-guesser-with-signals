import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessTheSongComponent } from './guess-the-song.component';

describe('GuessTheSongComponent', () => {
  let component: GuessTheSongComponent;
  let fixture: ComponentFixture<GuessTheSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GuessTheSongComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessTheSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
