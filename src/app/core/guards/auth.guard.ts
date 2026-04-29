import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const AuthGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  const current = session.currentPlayer();

  if (current) return true;

  return router.createUrlTree(['/']);
};