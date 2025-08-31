import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-test-routing',
  template: `
    <div class="container mt-5">
      <h2>Teste de Roteamento - Componentes Transferidos</h2>

      <!-- Informações do Usuário -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Status da Autenticação</h5>
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Usuário:</strong> {{ currentUser?.name || 'Não logado' }}</p>
                  <p><strong>Email:</strong> {{ currentUser?.email || 'Não logado' }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Tipo:</strong>
                    <span class="badge" [ngClass]="{
                      'bg-success': userType === 'cliente',
                      'bg-primary': userType === 'profissional',
                      'bg-secondary': userType === 'Não autenticado'
                    }">
                      {{ userType }}
                    </span>
                  </p>
                  <p><strong>Status:</strong>
                    <span class="badge" [ngClass]="{
                      'bg-success': currentUser && userType !== 'Não autenticado',
                      'bg-warning': currentUser && userType === 'Não autenticado',
                      'bg-danger': !currentUser
                    }">
                      {{ currentUser && userType !== 'Não autenticado' ? 'Autenticado' :
                         currentUser ? 'Usuário Inválido' : 'Não Autenticado' }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards de Navegação -->
      <div class="row">
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Dashboard Profissional</h5>
              <p class="card-text">Teste do dashboard para profissionais</p>
              <button class="btn btn-primary" (click)="navegarParaDashboard()"
                      [disabled]="userType !== 'profissional'">
                <i class="bi bi-speedometer2 me-2"></i>
                Acessar
              </button>
              <small class="text-muted d-block mt-2" *ngIf="userType !== 'profissional'">
                Apenas profissionais podem acessar
              </small>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Home Cliente</h5>
              <p class="card-text">Teste da home para clientes</p>
              <button class="btn btn-success" (click)="navegarParaHomeCliente()"
                      [disabled]="userType !== 'cliente'">
                <i class="bi bi-house me-2"></i>
                Acessar
              </button>
              <small class="text-muted d-block mt-2" *ngIf="userType !== 'cliente'">
                Apenas clientes podem acessar
              </small>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Home Profissional</h5>
              <p class="card-text">Teste da home para profissionais</p>
              <button class="btn btn-info" (click)="navegarParaHomeProfissional()"
                      [disabled]="userType !== 'profissional'">
                <i class="bi bi-person-badge me-2"></i>
                Acessar
              </button>
              <small class="text-muted d-block mt-2" *ngIf="userType !== 'profissional'">
                Apenas profissionais podem acessar
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão de Logout -->
      <div class="row mt-4" *ngIf="currentUser">
        <div class="col-12 text-center">
          <button class="btn btn-outline-danger" (click)="logout()">
            <i class="bi bi-box-arrow-right me-2"></i>
            Fazer Logout
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
  `],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TestRoutingComponent implements OnInit {
  currentUser: User | null = null;
  userType: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

    ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userType = this.authService.getUserType() || 'Não autenticado';

    // Atualizar o status quando o estado de autenticação mudar
    this.authService.authState$.subscribe(authState => {
      this.currentUser = authState.user;
      this.userType = authState.user?.tipo || 'Não autenticado';
      console.log('🔍 Debug - TestRouting - authState mudou:', authState);
      console.log('🔍 Debug - TestRouting - currentUser:', this.currentUser);
      console.log('🔍 Debug - TestRouting - userType:', this.userType);
    });
  }

  navegarParaDashboard(): void {
    this.router.navigate(['/dashboard-profissional']);
  }

  navegarParaHomeCliente(): void {
    this.router.navigate(['/home-cliente']);
  }

  navegarParaHomeProfissional(): void {
    this.router.navigate(['/home-profissional']);
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.userType = 'Não autenticado';
  }
}
