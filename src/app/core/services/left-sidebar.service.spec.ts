import { TestBed } from '@angular/core/testing';

import { LeftSidebarService } from './left-sidebar.service';

describe('LeftSidebarService', () => {
  let service: LeftSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeftSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
