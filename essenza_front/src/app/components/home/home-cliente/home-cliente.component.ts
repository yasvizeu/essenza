import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeClienteComponent implements OnInit {
  currentUser: User | null = null;
  user: User | null = null;
  proximosAgendamentos = [
    {
      id: 1,
      data: '2024-01-15',
      horario: '14:00',
      servico: 'Consulta de Rotina',
      profissional: 'Dr. Silva',
      status: 'Confirmado'
    },
    {
      id: 2,
      data: '2024-01-20',
      horario: '10:30',
      servico: 'Exame Especializado',
      profissional: 'Dra. Santos',
      status: 'Pendente'
    }
  ];

  produtosRecomendados = [
    {
      id: 1,
      nome: 'Suplemento Vitamínico',
      descricao: 'Complexo vitamínico para saúde geral',
      preco: 89.90,
      imagem: 'assets/images/produto1.jpg',
      categoria: 'Suplementos'
    },
    {
      id: 2,
      nome: 'Óleo de Coco',
      descricao: 'Óleo de coco extra virgem orgânico',
      preco: 45.50,
      imagem: 'assets/images/produto2.jpg',
      categoria: 'Óleos'
    }
  ];

  // Propriedades para o template
  agendamentos = this.proximosAgendamentos;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.user = this.currentUser;
  }

  // Métodos de navegação
  navegarParaAgendamento(): void {
    this.router.navigate(['/agendamento']);
  }

  navegarParaProdutos(): void {
    this.router.navigate(['/produtos']);
  }

  navegarParaCarrinho(): void {
    this.router.navigate(['/cart']);
  }

  navegarParaPerfil(): void {
    this.router.navigate(['/perfil']);
  }
}
