import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { RegistroStateService } from './registro-state.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private registro: RegistroStateService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const user = this.registro.getDadosRegistro();
    if (user && user.type === 'profissional') return true;
    return this.router.parseUrl('/home');
  }
}


