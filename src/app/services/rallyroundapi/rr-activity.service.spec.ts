import { TestBed } from '@angular/core/testing';

import { RrActivityService } from './rr-activity.service';

describe('RrActivityService', () => {
  let service: RrActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RrActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
