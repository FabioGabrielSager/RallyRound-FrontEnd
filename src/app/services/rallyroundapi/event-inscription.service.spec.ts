import { TestBed } from '@angular/core/testing';

import { EventInscriptionService } from './event-inscription.service';

describe('ParticipantService', () => {
  let service: EventInscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventInscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
