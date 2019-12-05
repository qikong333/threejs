import { TestBed } from '@angular/core/testing';

import { OutlinePassService } from './outline-pass.service';

describe('OutlinePassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OutlinePassService = TestBed.get(OutlinePassService);
    expect(service).toBeTruthy();
  });
});
