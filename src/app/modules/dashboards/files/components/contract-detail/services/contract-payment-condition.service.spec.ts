import { TestBed } from '@angular/core/testing';

import { ContractPaymentConditionService } from './contract-payment-condition.service';

describe('ContractPaymentConditionService', () => {
  let service: ContractPaymentConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractPaymentConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
