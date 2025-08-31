import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ServicosComponent implements OnInit {
  servicos: any[] = [];
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

  carregarServicos(): void {
    this.isLoading = true;
    this.apiService.getServicos().subscribe({
      next: (servicos) => {
        this.servicos = servicos;
        this.isLoading = false;
        console.log('✅ Serviços carregados:', servicos);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar serviços:', error);
        this.isLoading = false;
      }
    });
  }

  voltarParaDashboard(): void {
    this.router.navigate(['/dashboard-profissional']);
  }
}
