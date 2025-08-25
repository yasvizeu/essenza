import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegistroStateService } from '../../services/registro-state.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  userName: string | null = null;
  constructor(private auth: AuthService, private registro: RegistroStateService, private router: Router) {
    this.userName = this.registro.getDadosRegistro()?.name ?? null;
    this.registro.dadosRegistro$.subscribe(u => this.userName = u?.name ?? null);
  }

  onLogout(): void {
    this.auth.clearToken();
    this.registro.clearDadosRegistro();
    this.router.navigate(['/login']);
  }
}
