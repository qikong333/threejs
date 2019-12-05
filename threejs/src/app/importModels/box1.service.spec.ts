import { TestBed } from '@angular/core/testing';

import { Box1Service } from './box1.service';

describe('Box1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Box1Service = TestBed.get(Box1Service);
    expect(service).toBeTruthy();
  });
});
