import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventResumeCardComponent } from './event-resume-card.component';

describe('EventResumeCardComponent', () => {
  let component: EventResumeCardComponent;
  let fixture: ComponentFixture<EventResumeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventResumeCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventResumeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
