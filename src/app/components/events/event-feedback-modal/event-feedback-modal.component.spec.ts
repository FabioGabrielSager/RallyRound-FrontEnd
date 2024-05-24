import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFeedbackModalComponent } from './event-feedback-modal.component';

describe('EventFeedbackModalComponent', () => {
  let component: EventFeedbackModalComponent;
  let fixture: ComponentFixture<EventFeedbackModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFeedbackModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventFeedbackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
