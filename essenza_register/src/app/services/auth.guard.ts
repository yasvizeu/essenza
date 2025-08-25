import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { RegistroStateService } from './registro-state.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private registro: RegistroStateService, private router: Router, private auth: AuthService) {}

  canActivate(): boolean | UrlTree {
    const user = this.registro.getDadosRegistro();
    if (user && !this.auth.isTokenExpired()) return true;
    return this.router.parseUrl('/login');
  }
}


