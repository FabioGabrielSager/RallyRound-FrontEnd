import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { clearAuthCacheGuard } from './clear-auth-cache.guard';

describe('clearAuthCacheGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => clearAuthCacheGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
