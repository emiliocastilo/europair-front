import { TestBed } from '@angular/core/testing';

import { RolesTableAdapterService } from './roles-table-adapter.service';

describe('RolesTableAdapterService', () => {
  let service: RolesTableAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesTableAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
