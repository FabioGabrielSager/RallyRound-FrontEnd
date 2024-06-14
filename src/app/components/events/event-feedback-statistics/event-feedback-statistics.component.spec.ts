import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFeedbackStatisticsComponent } from './event-feedback-statistics.component';

describe('EventFeedbackStatisticsComponent', () => {
  let component: EventFeedbackStatisticsComponent;
  let fixture: ComponentFixture<EventFeedbackStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFeedbackStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventFeedbackStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
