import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackWordComponent } from './feedback-word.component';

describe('FeedbackWordComponent', () => {
  let component: FeedbackWordComponent;
  let fixture: ComponentFixture<FeedbackWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeedbackWordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
