import { TestBed } from '@angular/core/testing';

import { ChassisService } from './chassis.service';

describe('ChassisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChassisService = TestBed.get(ChassisService);
    expect(service).toBeTruthy();
  });
});
