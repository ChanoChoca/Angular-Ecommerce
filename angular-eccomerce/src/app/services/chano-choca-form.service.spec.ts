import { TestBed } from '@angular/core/testing';

import { ChanoChocaFormService } from './chano-choca-form.service';

describe('ChanoChocaFormService', () => {
  let service: ChanoChocaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChanoChocaFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
