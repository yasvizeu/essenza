import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  categoria?: string;
  dataValidade?: string;
  baseUnit: string;
  emEstoque?: boolean;
}

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number | string; // Pode vir como string do DECIMAL do MySQL
  duracao?: number;
  categoria?: string;
  imagem?: string;
  disponivel?: boolean; // Temporariamente opcional
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Cliente {
  id: number;
  email: string;
  nome: string;
  name?: string; // opcional: compatibilidade com backend que retorna 'name'
  cpf: string;
  birthDate: string;
  cell: string;
  address: string;
  tipo: 'cliente' | 'profissional';
}

export interface Profissional {
  id: number;
  email: string;
  nome: string;
  name?: string; // opcional: compatibilidade com backend que retorna 'name'
  cpf: string;
  birthDate: string;
  cell: string;
  address: string;
  especialidade?: string;
  admin?: boolean;
  cnec?: number;
  tipo: 'cliente' | 'profissional';
}

export interface MovimentoEstoque {
  id: number;
  produtoId: number;
  quantidade: number;
  motivo: string;
  refTipo?: string;
  refId?: string;
  criadoEm: string;
}

export interface SaldoProduto {
  produtoId: number;
  nome: string;
  saldo: number;
  unidade: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // ===== PRODUTOS E ESTOQUE =====
  
  // Buscar todos os produtos
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/produtos`);
  }

  // Buscar saldo de um produto
  getSaldoProduto(produtoId: number): Observable<SaldoProduto> {
    return this.http.get<SaldoProduto>(`${this.apiUrl}/inventario/produtos/${produtoId}/saldo`);
  }

  // Buscar movimentações de um produto
  getMovimentacoesProduto(produtoId: number, limit: number = 50): Observable<MovimentoEstoque[]> {
    return this.http.get<MovimentoEstoque[]>(`${this.apiUrl}/inventario/produtos/${produtoId}/extrato?limit=${limit}`);
  }

  // Criar movimento de estoque
  criarMovimentoEstoque(movimento: {
    produtoId: number;
    quantidade: number;
    motivo: string;
    refTipo?: string;
    refId?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/inventario/estoque/movimentos`, movimento);
  }

  // ===== SERVIÇOS =====
  
  // Buscar todos os serviços
  getServicos(): Observable<Servico[]> {
    return this.http.get<PaginatedResponse<Servico>>(`${this.apiUrl}/servico`).pipe(
      map(response => response.data)
    );
  }

  // Executar serviço (baixa automática no estoque)
  executarServico(execucao: {
    servicoId: number;
    quantidade: number;
    refTipo?: string;
    refId?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/inventario/ordens-servico/execucoes`, execucao);
  }

  // ===== CLIENTES =====
  
  // Buscar todos os clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  // Buscar cliente por ID
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/clientes/${id}`);
  }

  // Buscar clientes por nome (filtro)
  buscarClientesPorNome(nome: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes?nome=${nome}`);
  }

  // ===== PROFISSIONAIS =====
  
  // Buscar todos os profissionais
  getProfissionais(): Observable<Profissional[]> {
    return this.http.get<Profissional[]>(`${this.apiUrl}/profissionais`);
  }

  // Cadastrar novo profissional
  cadastrarProfissional(profissional: {
    email: string;
    nome: string;
    senha: string;
    cpf: string;
    birthDate: string;
    cell: string;
    address: string;
    especialidade?: string;
    admin?: boolean;
    cnec?: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/profissionais`, profissional);
  }

  // ===== ESTATÍSTICAS DO DASHBOARD =====
  
  // Buscar estatísticas gerais
  getEstatisticas(): Observable<{
    totalClientes: number;
    totalProdutos: number;
    totalServicos: number;
    produtosBaixoEstoque: number;
    movimentacoesHoje: number;
  }> {
    return this.http.get<{
      totalClientes: number;
      totalProdutos: number;
      totalServicos: number;
      produtosBaixoEstoque: number;
      movimentacoesHoje: number;
    }>(`${this.apiUrl}/dashboard/estatisticas`);
  }

  // Buscar produtos com baixo estoque
  getProdutosBaixoEstoque(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/dashboard/produtos-baixo-estoque`);
  }

  // Buscar últimas movimentações
  getUltimasMovimentacoes(limit: number = 10): Observable<MovimentoEstoque[]> {
    return this.http.get<MovimentoEstoque[]>(`${this.apiUrl}/dashboard/ultimas-movimentacoes?limit=${limit}`);
  }
}
