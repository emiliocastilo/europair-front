import { TestBed } from '@angular/core/testing';

import { OperatorsTableAdapterService } from './operators-table-adapter.service';

describe('OperatorsTableAdapterService', () => {
  let service: OperatorsTableAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperatorsTableAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
