import { TestBed } from '@angular/core/testing';

import { RegionsTableAdapterService } from './regions-table-adapter.service';

describe('RegionsTableAdapterService', () => {
  let service: RegionsTableAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionsTableAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
