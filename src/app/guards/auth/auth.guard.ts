import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../../services/auth/auth.service";
import {inject} from "@angular/core";
import {catchError, map, of, tap} from "rxjs";

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if(!authService.currentUserLoginOn.value) {
    return router.parseUrl('/login');
  }

  // Check with the server if the token is valid.
  return authService.validateUserToken().pipe(
    map((value) => {
      if(value) {
        return true;
      }
      return router.parseUrl('/login')
    }),
    catchError(err => of(router.parseUrl('/login')))
  );
};
