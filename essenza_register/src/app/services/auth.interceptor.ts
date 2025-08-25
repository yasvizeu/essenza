import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { EssenzaService } from './essenza.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshing = false;
  constructor(private auth: AuthService, private api: EssenzaService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    if (token) {
      const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      return next.handle(cloned).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401 && !this.refreshing) {
            this.refreshing = true;
            return this.api.refreshToken().pipe(
              switchMap(({ token }) => {
                this.auth.setToken(token);
                this.refreshing = false;
                const retried = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
                return next.handle(retried);
              }),
              catchError(e => { this.refreshing = false; this.auth.clearToken(); return throwError(() => e); })
            );
          }
          return throwError(() => err);
        })
      );
    }
    return next.handle(req);
  }
}


