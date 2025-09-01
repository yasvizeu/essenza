import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.html',
  styleUrl: './sobre.scss',
  imports: [CommonModule],
  standalone: true
})
export class Sobre {
  // Dados da empresa
  empresa = {
    nome: 'Essenza Estética',
    fundacao: '2020',
    missao: 'Transformar vidas através de produtos naturais e sustentáveis, promovendo saúde, bem-estar e consciência ambiental.',
    visao: 'Ser referência em tratamentos estéticos naturais e sustentáveis, contribuindo para o bem-estar e autoestima de nossos clientes.',
    valores: [
      'Sustentabilidade e respeito ao meio ambiente',
      'Qualidade e segurança em todos os produtos',
      'Atendimento personalizado e humanizado',
      'Inovação e tecnologia em tratamentos estéticos',
      'Transparência e ética em todas as relações'
    ]
  };

  // Equipe
  equipe = [
    {
      nome: 'Dra. Ana Silva',
      cargo: 'Dermatologista',
      especialidade: 'Tratamentos Anti-idade',
      imagem: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      descricao: 'Especialista em dermatologia estética com mais de 10 anos de experiência.'
    },
    {
      nome: 'Dr. Carlos Mendes',
      cargo: 'Esteticista',
      especialidade: 'Limpeza de Pele',
      imagem: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      descricao: 'Profissional dedicado aos tratamentos de limpeza e hidratação facial.'
    },
    {
      nome: 'Dra. Maria Santos',
      cargo: 'Cosmetóloga',
      especialidade: 'Peeling Químico',
      imagem: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      descricao: 'Especialista em tratamentos com ácidos e renovação celular.'
    }
  ];

  // Estatísticas
  estatisticas = [
    { numero: '1000+', descricao: 'Clientes Atendidos' },
    { numero: '50+', descricao: 'Tratamentos Diferentes' },
    { numero: '98%', descricao: 'Satisfação dos Clientes' },
    { numero: '3', descricao: 'Anos de Experiência' }
  ];
}
