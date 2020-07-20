import { TestBed } from '@angular/core/testing';

import { TasksTableAdapterService } from './tasks-table-adapter.service';

describe('TasksTableAdapterService', () => {
  let service: TasksTableAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksTableAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
