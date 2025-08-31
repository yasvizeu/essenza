import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Adicionar token se existir
  const token = localStorage.getItem('auth_token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Interceptor error:', error);
      
      // Se receber 401 (Unauthorized), fazer logout
      if (error.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Redirecionar para login
        window.location.href = '/login';
      }
      
      return throwError(() => error);
    })
  );
};
