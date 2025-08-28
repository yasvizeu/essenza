import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.authState$.pipe(
      take(1),
      map(authState => {
        if (!authState.isAuthenticated) {
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return false;
        }

        // Verificar se a rota tem dados de role requerida
        const requiredRole = route.data['role'];
        if (!requiredRole) {
          return true; // Se não há role específica, permitir acesso
        }

        // Verificar se o usuário tem a role necessária
        if (this.authService.hasRole(requiredRole)) {
          return true;
        } else {
          // Redirecionar para página de acesso negado
          this.router.navigate(['/home']);
          return false;
        }
      })
    );
  }
}
