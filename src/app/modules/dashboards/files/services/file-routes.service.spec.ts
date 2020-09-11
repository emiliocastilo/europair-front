import { TestBed } from '@angular/core/testing';

import { FileRoutesService } from './file-routes.service';

describe('FileRoutesService', () => {
  let service: FileRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
