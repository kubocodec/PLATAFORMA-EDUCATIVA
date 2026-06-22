import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userData = localStorage.getItem('userData');

  if (userData) {
    const user = JSON.parse(userData);
    if (user.role === 'ADMIN') {
      return true;
    }
  }

  router.navigate(['/dashboard']);
  return false;
};
