import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // rutas públicas — no necesitan token
  if (req.url.includes('/auth/login') || req.url.includes('/token/refresh')) {
    return next(req);
  }

  const token = authService.getToken();
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refresh = authService.getRefreshToken();
        if (refresh) {
          return authService.refreshToken().pipe(
            switchMap((res: any) => {
              authService.saveToken(res.access);
              const retried = req.clone({ setHeaders: { Authorization: `Bearer ${res.access}` } });
              return next(retried);
            }),
            catchError((err) => {
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => err);
            })
          );
        }
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};