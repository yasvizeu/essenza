import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthService } from './services/auth';

// Interceptor funcional
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔍 AuthInterceptor - EXECUTANDO para URL:', req.url);
  
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  
  console.log('🔍 AuthInterceptor - Token encontrado:', !!token);
  console.log('🔍 AuthInterceptor - Token completo:', token);
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('🔍 AuthInterceptor - Header Authorization:', authReq.headers.get('Authorization'));
    return next(authReq);
  }
  
  console.log('🔍 AuthInterceptor - Requisição SEM token');
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
