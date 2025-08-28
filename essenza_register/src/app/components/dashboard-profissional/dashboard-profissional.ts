import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-profissional',
  standalone: false,
  templateUrl: './dashboard-profissional.html',
  styleUrls: ['./dashboard-profissional.scss']
})
export class DashboardProfissional implements OnInit, OnDestroy {
  user: User | null = null;
  produtos: any[] = [];
  clientes: User[] = [];
  fichasAnamnese: any[] = [];
  isLoading = false;
  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authState$.subscribe(
      authState => {
        this.user = authState.user;
        if (authState.isAuthenticated && authState.user?.tipo === 'profissional') {
          this.loadDashboardData();
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Carregar dados do dashboard
    Promise.all([
      this.apiService.getProdutos().toPromise(),
      this.apiService.getClientes().toPromise(),
      this.apiService.getFichasAnamnese().toPromise()
    ]).then(([produtos, clientes, fichas]) => {
      this.produtos = produtos || [];
      this.clientes = clientes || [];
      this.fichasAnamnese = fichas || [];
      this.isLoading = false;
    }).catch(error => {
      console.error('Erro ao carregar dados do dashboard:', error);
      this.isLoading = false;
    });
  }

  navegarParaEstoque(): void {
    this.router.navigate(['/estoque']);
  }

  navegarParaClientes(): void {
    this.router.navigate(['/clientes']);
  }

  navegarParaAnamnese(): void {
    this.router.navigate(['/anamnese']);
  }

  navegarParaProdutos(): void {
    this.router.navigate(['/produtos']);
  }

  get totalProdutos(): number {
    return this.produtos.length;
  }

  get totalClientes(): number {
    return this.clientes.length;
  }

  get totalFichas(): number {
    return this.fichasAnamnese.length;
  }
}

