import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';

export const authenticationGuard = () => {
  const _router = inject(Router);
  const _authService = inject(AuthService);

  if (_authService.isLoggedIn()) {
    return true;
  }

  return _router.navigate(['/login']);
};
