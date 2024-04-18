import { HttpInterceptorFn } from '@angular/common/http';
import {AuthService} from "../auth.service";
import {inject} from "@angular/core";

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);

  let token: string | null = authService.currentUserLoginOnToken.value;

  if(token) {
    req = req.clone({headers: req.headers.append('Authorization', 'Bearer ' + token)})
  }

  return next(req);
};
