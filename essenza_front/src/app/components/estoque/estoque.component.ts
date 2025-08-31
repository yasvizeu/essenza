import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class EstoqueComponent implements OnInit {
  produtos: any[] = [];
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.isLoading = true;
    this.apiService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.isLoading = false;
        console.log('✅ Produtos carregados:', produtos);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar produtos:', error);
        this.isLoading = false;
      }
    });
  }

  voltarParaDashboard(): void {
    this.router.navigate(['/dashboard-profissional']);
  }
}
