import { TestBed } from '@angular/core/testing';

import { MPAuthService } from './mpauth.service';

describe('MPAuthService', () => {
  let service: MPAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MPAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
