import { TestBed } from '@angular/core/testing';

import { authenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {
  let guard = authenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
