import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<unknown> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  let isRefreshing = false;
  let refreshTokenSubject = new BehaviorSubject<any>(null);

  const addToken = (req: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  const handle401Error = (req: HttpRequest<unknown>, nextHandler: HttpHandlerFn): Observable<unknown> => {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap((token: string) => {
          isRefreshing = false;
          refreshTokenSubject.next(token);
          return nextHandler(addToken(req, token));
        }),
        catchError((err) => {
          isRefreshing = false;
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    } else {
      return refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return nextHandler(addToken(req, token));
        })
      );
    }
  };

  const token = authService.getToken();
  
  if (token) {
    request = addToken(request, token);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !request.url.includes('auth/refresh')) {
        return handle401Error(request, next);
      }
      return throwError(() => error);
    })
  );
};
