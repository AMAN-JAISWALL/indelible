import { TestBed } from '@angular/core/testing';

import { UsermanagementService } from './usermanagement.service';

describe('UsermanagementService', () => {
  let service: UsermanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsermanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
