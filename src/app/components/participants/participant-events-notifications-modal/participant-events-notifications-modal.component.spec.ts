import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantEventsNotificationsModalComponent } from './participant-events-notifications-modal.component';

describe('ParitcipantNotificationsModalComponent', () => {
  let component: ParticipantEventsNotificationsModalComponent;
  let fixture: ComponentFixture<ParticipantEventsNotificationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantEventsNotificationsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantEventsNotificationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
