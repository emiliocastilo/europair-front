import { TestBed } from '@angular/core/testing';
import { CancellationFeesService } from './cancellation-fees.service';

describe('UsersService', () => {
  let service: CancellationFeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancellationFeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
