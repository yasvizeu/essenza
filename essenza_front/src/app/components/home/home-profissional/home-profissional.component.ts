import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-home-profissional',
  templateUrl: './home-profissional.component.html',
  styleUrls: ['./home-profissional.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeProfissionalComponent implements OnInit {
  currentUser: User | null = null;
  user: User | null = null;
  estatisticas = {
    agendamentosHoje: 8,
    agendamentosSemana: 45,
    clientesAtendidos: 45,
    clientesAtivos: 156,
    produtosEstoque: 156,
    produtosBaixoEstoque: 12,
    receitaMes: 12500,
    faturamentoMes: 12500
  };

  agendamentosHoje = [
    {
      id: 1,
      horario: '09:00',
      cliente: 'Maria Silva',
      servico: 'Consulta de Rotina',
      status: 'Confirmado',
      duracao: '60 min'
    },
    {
      id: 2,
      horario: '10:30',
      cliente: 'João Santos',
      servico: 'Exame Especializado',
      status: 'Pendente',
      duracao: '90 min'
    },
    {
      id: 3,
      horario: '14:00',
      cliente: 'Ana Costa',
      servico: 'Tratamento Facial',
      status: 'Confirmado',
      duracao: '45 min'
    }
  ];

  produtosBaixoEstoque = [
    {
      id: 1,
      nome: 'Creme Hidratante Premium',
      estoque: 5,
      minimo: 10
    },
    {
      id: 2,
      nome: 'Sérum Anti-idade',
      estoque: 3,
      minimo: 8
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.user = this.currentUser;
  }

  // Métodos de navegação
  navegarParaEstoque(): void {
    this.router.navigate(['/estoque']);
  }

  navegarParaAgendamentos(): void {
    this.router.navigate(['/agendamentos-profissional']);
  }

  navegarParaClientes(): void {
    this.router.navigate(['/clientes']);
  }

  navegarParaRelatorios(): void {
    this.router.navigate(['/relatorios']);
  }

  navegarParaDashboard(): void {
    this.router.navigate(['/dashboard-profissional']);
  }

  // Métodos auxiliares
  getStatusClass(status: string): string {
    switch (status) {
      case 'Confirmado': return 'bg-success';
      case 'Pendente': return 'bg-warning';
      case 'Cancelado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getProdutosBaixoEstoque(): any[] {
    return this.produtosBaixoEstoque.filter(p => p.estoque <= p.minimo);
  }

  temProdutosBaixoEstoque(): boolean {
    return this.getProdutosBaixoEstoque().length > 0;
  }
}
