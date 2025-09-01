import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { DashboardService, Produto, Servico, Cliente, Profissional, MovimentoEstoque, SaldoProduto } from '../../services/dashboard';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-dashboard-profissional',
  templateUrl: './dashboard-profissional.html',
  styleUrl: './dashboard-profissional.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilterPipe],
  standalone: true
})
export class DashboardProfissionalComponent implements OnInit {
  // Dados do usuário logado
  currentUser: any;
  
  // Dados do dashboard
  produtos: Produto[] = [];
  servicos: Servico[] = [];
  clientes: Cliente[] = [];
  profissionais: Profissional[] = [];
  ultimasMovimentacoes: MovimentoEstoque[] = [];
  produtosBaixoEstoque: Produto[] = [];
  
  // Estatísticas
  estatisticas = {
    totalClientes: 0,
    totalProdutos: 0,
    totalServicos: 0,
    produtosBaixoEstoque: 0,
    movimentacoesHoje: 0
  };

  // Estados de carregamento
  isLoading = false;
  isLoadingProdutos = false;
  isLoadingClientes = false;
  isLoadingServicos = false;

  // Estados dos modais
  showModalEstoque = false;
  showModalNovoProfissional = false;
  showModalBuscarClientes = false;
  showModalExecutarServico = false;

  // Formulários
  movimentoEstoqueForm: FormGroup;
  novoProfissionalForm: FormGroup;
  buscarClientesForm: FormGroup;
  executarServicoForm: FormGroup;

  // Filtros e busca
  filtroProdutos = '';
  filtroClientes = '';
  clientesFiltrados: Cliente[] = [];

  // Produto selecionado para detalhes
  produtoSelecionado: Produto | null = null;
  saldoProduto: SaldoProduto | null = null;
  movimentacoesProduto: MovimentoEstoque[] = [];

  // Serviço selecionado
  servicoSelecionado: Servico | null = null;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.checkAuth();
    this.loadDashboardData();
  }

  // Verificar autenticação
  private checkAuth(): void {
    if (!this.authService.isAuthenticated() || !this.authService.isProfissional()) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = this.authService.getCurrentUser();
  }

  // Inicializar formulários
  private initForms(): void {
    this.movimentoEstoqueForm = this.fb.group({
      produtoId: ['', Validators.required],
      quantidade: ['', [Validators.required, Validators.min(-999999), Validators.max(999999)]],
      motivo: ['', Validators.required],
      refTipo: [''],
      refId: ['']
    });

    this.novoProfissionalForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      cpf: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      cell: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      especialidade: [''],
      admin: [false],
      cnec: ['']
    });

    this.buscarClientesForm = this.fb.group({
      nome: ['']
    });

    this.executarServicoForm = this.fb.group({
      servicoId: ['', Validators.required],
      quantidade: ['', [Validators.required, Validators.min(1)]],
      refTipo: [''],
      refId: ['']
    });
  }

  // Carregar dados do dashboard
  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Carregar dados em paralelo
    Promise.all([
      this.loadProdutos(),
      this.loadServicos(),
      this.loadClientes(),
      this.loadProfissionais(),
      this.loadEstatisticas(),
      this.loadUltimasMovimentacoes(),
      this.loadProdutosBaixoEstoque()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  // Carregar produtos
  private loadProdutos(): Promise<void> {
    this.isLoadingProdutos = true;
    return this.dashboardService.getProdutos().toPromise()
      .then(produtos => {
        this.produtos = produtos || [];
      })
      .catch(error => {
        console.error('Erro ao carregar produtos:', error);
        this.produtos = [];
      })
      .finally(() => {
        this.isLoadingProdutos = false;
      });
  }

  // Carregar serviços
  private loadServicos(): Promise<void> {
    return this.dashboardService.getServicos().toPromise()
      .then(servicos => {
        this.servicos = servicos || [];
      })
      .catch(error => {
        console.error('Erro ao carregar serviços:', error);
        this.servicos = [];
      });
  }

  // Carregar clientes
  private loadClientes(): Promise<void> {
    this.isLoadingClientes = true;
    return this.dashboardService.getClientes().toPromise()
      .then(clientes => {
        this.clientes = clientes || [];
        this.clientesFiltrados = [...this.clientes];
      })
      .catch(error => {
        console.error('Erro ao carregar clientes:', error);
        this.clientes = [];
        this.clientesFiltrados = [];
      })
      .finally(() => {
        this.isLoadingClientes = false;
      });
  }

  // Carregar profissionais
  private loadProfissionais(): Promise<void> {
    return this.dashboardService.getProfissionais().toPromise()
      .then(profissionais => {
        this.profissionais = profissionais || [];
      })
      .catch(error => {
        console.error('Erro ao carregar profissionais:', error);
        this.profissionais = [];
      });
  }

  // Carregar estatísticas
  private loadEstatisticas(): Promise<void> {
    return this.dashboardService.getEstatisticas().toPromise()
      .then(stats => {
        this.estatisticas = stats || {
          totalClientes: 0,
          totalProdutos: 0,
          totalServicos: 0,
          produtosBaixoEstoque: 0,
          movimentacoesHoje: 0
        };
      })
      .catch(error => {
        console.error('Erro ao carregar estatísticas:', error);
      });
  }

  // Carregar últimas movimentações
  private loadUltimasMovimentacoes(): Promise<void> {
    return this.dashboardService.getUltimasMovimentacoes(10).toPromise()
      .then(movimentacoes => {
        this.ultimasMovimentacoes = movimentacoes || [];
      })
      .catch(error => {
        console.error('Erro ao carregar movimentações:', error);
        this.ultimasMovimentacoes = [];
      });
  }

  // Carregar produtos com baixo estoque
  private loadProdutosBaixoEstoque(): Promise<void> {
    return this.dashboardService.getProdutosBaixoEstoque().toPromise()
      .then(produtos => {
        this.produtosBaixoEstoque = produtos || [];
      })
      .catch(error => {
        console.error('Erro ao carregar produtos com baixo estoque:', error);
        this.produtosBaixoEstoque = [];
      });
  }

  // ===== GESTÃO DE ESTOQUE =====

  // Abrir modal de estoque
  openModalEstoque(): void {
    this.showModalEstoque = true;
    this.movimentoEstoqueForm.reset();
  }

  // Fechar modal de estoque
  closeModalEstoque(): void {
    this.showModalEstoque = false;
    this.movimentoEstoqueForm.reset();
  }

  // Criar movimento de estoque
  criarMovimentoEstoque(): void {
    if (this.movimentoEstoqueForm.valid) {
      const movimento = this.movimentoEstoqueForm.value;
      
      this.dashboardService.criarMovimentoEstoque(movimento).subscribe({
        next: (response) => {
          console.log('Movimento criado com sucesso:', response);
          this.closeModalEstoque();
          this.loadDashboardData(); // Recarregar dados
          alert('Movimento de estoque criado com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao criar movimento:', error);
          alert('Erro ao criar movimento de estoque. Tente novamente.');
        }
      });
    }
  }

  // Ver detalhes do produto
  verDetalhesProduto(produto: Produto): void {
    this.produtoSelecionado = produto;
    
    // Carregar saldo do produto
    this.dashboardService.getSaldoProduto(produto.id).subscribe({
      next: (saldo) => {
        this.saldoProduto = saldo;
      },
      error: (error) => {
        console.error('Erro ao carregar saldo:', error);
        this.saldoProduto = null;
      }
    });

    // Carregar movimentações do produto
    this.dashboardService.getMovimentacoesProduto(produto.id, 20).subscribe({
      next: (movimentacoes) => {
        this.movimentacoesProduto = movimentacoes;
      },
      error: (error) => {
        console.error('Erro ao carregar movimentações:', error);
        this.movimentacoesProduto = [];
      }
    });
  }

  // ===== CADASTRO DE PROFISSIONAIS =====

  // Abrir modal de novo profissional
  openModalNovoProfissional(): void {
    this.showModalNovoProfissional = true;
    this.novoProfissionalForm.reset();
  }

  // Fechar modal de novo profissional
  closeModalNovoProfissional(): void {
    this.showModalNovoProfissional = false;
    this.novoProfissionalForm.reset();
  }

  // Cadastrar novo profissional
  cadastrarNovoProfissional(): void {
    if (this.novoProfissionalForm.valid) {
      const profissional = this.novoProfissionalForm.value;
      
      this.dashboardService.cadastrarProfissional(profissional).subscribe({
        next: (response) => {
          console.log('Profissional cadastrado com sucesso:', response);
          this.closeModalNovoProfissional();
          this.loadProfissionais(); // Recarregar lista
          alert('Profissional cadastrado com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao cadastrar profissional:', error);
          alert('Erro ao cadastrar profissional. Tente novamente.');
        }
      });
    }
  }

  // ===== BUSCA DE CLIENTES =====

  // Abrir modal de busca de clientes
  openModalBuscarClientes(): void {
    this.showModalBuscarClientes = true;
    this.buscarClientesForm.reset();
    this.clientesFiltrados = [...this.clientes];
  }

  // Fechar modal de busca de clientes
  closeModalBuscarClientes(): void {
    this.showModalBuscarClientes = false;
    this.buscarClientesForm.reset();
  }

  // Filtrar clientes
  filtrarClientes(): void {
    const nome = this.buscarClientesForm.get('nome')?.value || '';
    
    if (nome.trim() === '') {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados = this.clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(nome.toLowerCase()) ||
        cliente.email.toLowerCase().includes(nome.toLowerCase()) ||
        cliente.cpf.includes(nome)
      );
    }
  }

  // ===== EXECUÇÃO DE SERVIÇOS =====

  // Abrir modal de execução de serviço
  openModalExecutarServico(servico: Servico): void {
    this.servicoSelecionado = servico;
    this.showModalExecutarServico = true;
    this.executarServicoForm.patchValue({
      servicoId: servico.id,
      quantidade: 1
    });
  }

  // Fechar modal de execução de serviço
  closeModalExecutarServico(): void {
    this.showModalExecutarServico = false;
    this.executarServicoForm.reset();
    this.servicoSelecionado = null;
  }

  // Executar serviço
  executarServico(): void {
    if (this.executarServicoForm.valid) {
      const execucao = this.executarServicoForm.value;
      
      this.dashboardService.executarServico(execucao).subscribe({
        next: (response) => {
          console.log('Serviço executado com sucesso:', response);
          this.closeModalExecutarServico();
          this.loadDashboardData(); // Recarregar dados
          alert('Serviço executado com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao executar serviço:', error);
          alert('Erro ao executar serviço. Tente novamente.');
        }
      });
    }
  }

  // ===== UTILITÁRIOS =====

  // Logout
  logout(): void {
    this.authService.logout();
  }

  // Formatar data
  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  // Formatar hora
  formatarHora(data: string): string {
    return new Date(data).toLocaleTimeString('pt-BR');
  }

  // Formatar CPF
  formatarCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  // Formatar telefone
  formatarTelefone(telefone: string): string {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  // Formatar preço
  formatarPreco(preco: number): string {
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
  }

  // Formatar quantidade
  formatarQuantidade(quantidade: number, unidade: string): string {
    return `${quantidade} ${unidade}`;
  }

  // Verificar se produto está com baixo estoque
  isBaixoEstoque(produto: Produto): boolean {
    return (produto.quantidade || 0) < 10; // Considera baixo estoque se menos de 10 unidades
  }

  // Obter classe CSS para status do estoque
  getEstoqueClass(produto: Produto): string {
    if (this.isBaixoEstoque(produto)) {
      return 'text-danger';
    }
    return 'text-success';
  }

  // Obter ícone para motivo de movimentação
  getMotivoIcon(motivo: string): string {
    switch (motivo) {
      case 'compra':
        return 'bi-cart-plus';
      case 'execucao_servico':
        return 'bi-scissors';
      case 'ajuste':
        return 'bi-tools';
      case 'transferencia_entrada':
        return 'bi-arrow-down';
      case 'transferencia_saida':
        return 'bi-arrow-up';
      default:
        return 'bi-arrow-right';
    }
  }

  // Obter classe CSS para quantidade
  getQuantidadeClass(quantidade: number): string {
    return quantidade > 0 ? 'text-success' : 'text-danger';
  }
}
