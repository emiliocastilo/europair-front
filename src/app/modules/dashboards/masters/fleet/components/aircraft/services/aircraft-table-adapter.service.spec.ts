import { TestBed } from '@angular/core/testing';

import { AircraftTableAdapterService } from './aircraft-table-adapter.service';

describe('AircraftTableAdapterService', () => {
  let service: AircraftTableAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AircraftTableAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
