import { TestBed } from '@angular/core/testing';

import { UsersTableAdapterService } from './users-table-adapter.service';

describe('UsersTableAdapterService', () => {
  let service: UsersTableAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersTableAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
