// src/app/shared/header/header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para diretivas como *ngIf
import { RouterModule } from '@angular/router'; // Para routerLink

// Importe NgbDropdownModule para a funcionalidade de dropdown do ng-bootstrap
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule // Importe NgbDropdownModule aqui
  ]
})
export class HeaderComponent {
  // Você pode adicionar lógica aqui para gerenciar o estado do usuário, login, etc.
  isLoggedIn: boolean = false; // Exemplo: estado de login do usuário
  userName: string = 'Usuário'; // Exemplo: nome do usuário

  constructor() {
    // Exemplo: Simular um login/logout
    // Em um aplicativo real, isso viria de um serviço de autenticação
    setTimeout(() => {
      this.isLoggedIn = true;
      this.userName = '';
    }, 2000); // Simula login após 2 segundos
  }

  logout(): void {
    console.log('Sair da conta...');
    this.isLoggedIn = false;
    this.userName = 'Usuário';
    // Lógica real de logout aqui (limpar token, redirecionar, etc.)
  }
}