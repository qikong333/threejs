import { TestBed } from '@angular/core/testing';

import { AdnimationService } from './adnimation.service';

describe('AdnimationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdnimationService = TestBed.get(AdnimationService);
    expect(service).toBeTruthy();
  });
});
