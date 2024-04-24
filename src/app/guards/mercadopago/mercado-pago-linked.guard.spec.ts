import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { MercadoPagoLinkedGuard } from './mercado-pago-linked.guard';

describe('mercadoPagoLinkedGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => MercadoPagoLinkedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
