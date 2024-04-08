import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = localStorage.getItem('token');

  if(token) {
    req = req.clone({headers: req.headers.append('Authorization', 'Bearer ' + token)})
  }

  return next(req);
};
