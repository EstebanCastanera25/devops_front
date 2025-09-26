import { inject } from '@angular/core';
import { Router, UrlTree, CanActivateFn, CanMatchFn, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminService } from '../services/admin.service';


function isAllowed(required: string[] | undefined, mine: string[]): boolean {
  // si no definiste roles en data, se permite
  if (!required || required.length === 0) return true;
  // permite si el usuario tiene alguno de los roles requeridos
  return required.some(r => mine.includes(r));
}

function handleDeny(router: Router): UrlTree {
  // redirigí a donde prefieras (inicio, 403, login…)
  return router.createUrlTree(['/']);
}

export const roleGuardCanMatch: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const auth = inject(AdminService);
  const router = inject(Router);

  const required = (route.data?.['roles'] as string[]) || [];
  const mine = auth.getRoles(); // implementá getRoles() en tu AuthService
  return isAllowed(required, mine) ? true : handleDeny(router);
};

export const roleGuardCanActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AdminService);
  const router = inject(Router);

  const required = (route.data?.['roles'] as string[]) || [];
  const mine = auth.getRoles();
  return isAllowed(required, mine) ? true : handleDeny(router);
};