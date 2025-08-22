import { TestBed } from '@angular/core/testing';

import { RegistroStateService } from './registro-state.service';

describe('RegistroStateService', () => {
  let service: RegistroStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
