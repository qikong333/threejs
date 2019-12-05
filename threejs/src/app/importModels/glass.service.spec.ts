import { TestBed } from '@angular/core/testing';

import { GlassService } from './glass.service';

describe('GlassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlassService = TestBed.get(GlassService);
    expect(service).toBeTruthy();
  });
});
