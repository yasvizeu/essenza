import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obter o token de autenticação
    const token = this.authService.getAccessToken();
    
    console.log('🔍 AuthInterceptor - URL:', req.url);
    console.log('🔍 AuthInterceptor - Token:', token ? 'Token encontrado' : 'Token não encontrado');
    
    // Se houver token, adicionar o header Authorization
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('🔍 AuthInterceptor - Header adicionado:', authReq.headers.get('Authorization'));
      
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.log('🔍 AuthInterceptor - Token expirado, tentando renovar...');
            return this.handle401Error(authReq, next);
          }
          return throwError(() => error);
        })
      );
    }
    
    console.log('🔍 AuthInterceptor - Requisição sem token');
    // Se não houver token, continuar com a requisição original
    return next.handle(req);
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        const newToken = this.authService.getAccessToken();
        if (newToken) {
          const newReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${newToken}`)
          });
          console.log('🔍 AuthInterceptor - Token renovado, repetindo requisição');
          return next.handle(newReq);
        }
        return throwError(() => new Error('Falha ao renovar token'));
      }),
      catchError((error) => {
        console.log('🔍 AuthInterceptor - Falha ao renovar token, redirecionando para login');
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }
}
