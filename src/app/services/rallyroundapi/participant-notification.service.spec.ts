import { TestBed } from '@angular/core/testing';

import { ParticipantNotificationService } from './participant-notification.service';

describe('ParticipantNotificationService', () => {
  let service: ParticipantNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
