import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { DashboardService, Produto, Servico, Cliente, Profissional, MovimentoEstoque, SaldoProduto } from '../../services/dashboard';
import { AgendamentosService, Agendamento } from '../../services/agendamentos';
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
  agendamentos: Agendamento[] = [];
  
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
  isLoadingAgendamentos = false;

  // Estados dos modais
  showModalEstoque = false;
  showModalNovoProfissional = false;
  showModalBuscarClientes = false;
  showModalExecutarServico = false;
  showModalAgendamentos = false;

  // Formulários
  movimentoEstoqueForm!: FormGroup;
  novoProfissionalForm!: FormGroup;
  buscarClientesForm!: FormGroup;
  executarServicoForm!: FormGroup;

  // Filtros e busca
  filtroProdutos = '';
  filtroClientes = '';
  clientesFiltrados: Cliente[] = [];
  
  // Filtros da agenda
  filtroAgendamentos = '';
  filtroDataInicio = '';
  filtroDataFim = '';
  filtroStatus = '';
  filtroStatusPagamento = '';
  agendamentosFiltrados: Agendamento[] = [];
  
  // Estatísticas da agenda
  agendamentosHoje: Agendamento[] = [];
  agendamentosAmanha: Agendamento[] = [];
  agendamentosPendentes: Agendamento[] = [];
  receitaTotal = 0;

  // Produto selecionado para detalhes
  produtoSelecionado: Produto | null = null;
  saldoProduto: SaldoProduto | null = null;
  movimentacoesProduto: MovimentoEstoque[] = [];

  // Serviço selecionado
  servicoSelecionado: Servico | null = null;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private agendamentosService: AgendamentosService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.checkAuth();
    this.loadDashboardData();
    this.inicializarFiltrosAgenda();
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
      nome: ['', [Validators.required, Validators.minLength(3), this.nameValidator]],
      senha: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      cpf: ['', [Validators.required, this.cpfValidator]],
      birthDate: ['', [Validators.required, this.birthDateValidator]],
      cell: ['', [Validators.required, this.cellValidator]],
      address: ['', [Validators.required, Validators.minLength(10), this.addressValidator]],
      especialidade: ['', this.especialidadeValidator],
      admin: [false],
      cnec: ['', this.cnecValidator]
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
  loadDashboardData(): void {
    this.isLoading = true;
    
    // Carregar dados em paralelo
    Promise.all([
      this.loadProdutos(),
      this.loadServicos(),
      this.loadClientes(),
      this.loadProfissionais(),
      this.loadUltimasMovimentacoes(),
      this.loadProdutosBaixoEstoque(),
      this.loadAgendamentos()
    ]).then(() => {
      // Calcular estatísticas localmente após carregar todos os dados
      this.calcularEstatisticas();
      this.isLoading = false;
    }).catch(error => {
      console.error('Erro ao carregar dados do dashboard:', error);
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
        console.log('🔍 Debug - Profissionais carregados:', profissionais);
        this.profissionais = profissionais || [];
      })
      .catch(error => {
        console.error('Erro ao carregar profissionais:', error);
        this.profissionais = [];
      });
  }

  // Calcular estatísticas localmente
  private calcularEstatisticas(): void {
    console.log('🔍 Debug - Calculando estatísticas localmente');
    console.log('🔍 Debug - Dados disponíveis:', {
      clientes: this.clientes.length,
      produtos: this.produtos.length,
      servicos: this.servicos.length,
      produtosBaixoEstoque: this.produtosBaixoEstoque.length,
      movimentacoes: this.ultimasMovimentacoes.length
    });

    this.estatisticas = {
      totalClientes: this.clientes.length,
      totalProdutos: this.produtos.length,
      totalServicos: this.servicos.length,
      produtosBaixoEstoque: this.produtosBaixoEstoque.length,
      movimentacoesHoje: this.ultimasMovimentacoes.filter(mov => {
        const hoje = new Date().toDateString();
        const dataMov = new Date(mov.criadoEm).toDateString();
        return dataMov === hoje;
      }).length
    };

    console.log('🔍 Debug - Estatísticas calculadas:', this.estatisticas);
    console.log('🔍 Debug - Verificando se estatísticas foram atualizadas no template...');
    
    // Forçar detecção de mudanças
    this.cdr.detectChanges();
    
    setTimeout(() => {
      console.log('🔍 Debug - Estatísticas após timeout:', this.estatisticas);
      this.cdr.detectChanges();
    }, 100);
  }

  // Carregar estatísticas (comentado - agora calculamos localmente)
  // private loadEstatisticas(): Promise<void> {
  //   return this.dashboardService.getEstatisticas().toPromise()
  //     .then(stats => {
  //       this.estatisticas = stats || {
  //         totalClientes: 0,
  //         totalProdutos: 0,
  //         totalServicos: 0,
  //         produtosBaixoEstoque: 0,
  //         movimentacoesHoje: 0
  //       };
  //     })
  //     .catch(error => {
  //       console.error('Erro ao carregar estatísticas:', error);
  //     });
  // }

  // Carregar últimas movimentações
  private loadUltimasMovimentacoes(): Promise<void> {
    console.log('🔍 Debug - Carregando movimentações...');
    return this.dashboardService.getUltimasMovimentacoes(10).toPromise()
      .then(movimentacoes => {
        console.log('🔍 Debug - Movimentações carregadas:', movimentacoes);
        this.ultimasMovimentacoes = movimentacoes || [];
      })
      .catch(error => {
        console.error('Erro ao carregar movimentações:', error);
        this.ultimasMovimentacoes = [];
      });
  }

  // Carregar produtos com baixo estoque
  private loadProdutosBaixoEstoque(): Promise<void> {
    console.log('🔍 Debug - Carregando produtos com baixo estoque...');
    return this.dashboardService.getProdutosBaixoEstoque().toPromise()
      .then(produtos => {
        console.log('🔍 Debug - Produtos com baixo estoque carregados:', produtos);
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
      this.clientesFiltrados = this.clientes.filter(cliente => {
        const nomeCliente = (cliente.nome || (cliente as any).name || '').toLowerCase();
        return nomeCliente.includes(nome.toLowerCase()) ||
               cliente.email.toLowerCase().includes(nome.toLowerCase()) ||
               cliente.cpf.includes(nome);
      });
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
  formatarPreco(preco: number | string): string {
    const numericPrice = typeof preco === 'string' ? parseFloat(preco) : preco;
    if (isNaN(numericPrice)) {
      return 'R$ 0,00';
    }
    return `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;
  }

  // Verificar se produto está com baixo estoque
  isBaixoEstoque(produto: Produto): boolean {
    // Como a propriedade quantidade não existe na entidade Produto,
    // vamos usar a lista de produtos com baixo estoque que já é carregada
    return this.produtosBaixoEstoque.some(p => p.id === produto.id);
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

  // Obter data atual formatada
  getCurrentDate(): string {
    return new Date().toISOString();
  }

  // Obter nome do produto por ID
  getProdutoNome(produtoId: number): string {
    const produto = this.produtos.find(p => p.id === produtoId);
    return produto?.nome || 'N/A';
  }

  // ===== GESTÃO DE AGENDAMENTOS =====

  // Carregar agendamentos do profissional
  loadAgendamentos(): Promise<void> {
    console.log('🔍 Debug - Carregando agendamentos...');
    if (!this.currentUser?.id) {
      return Promise.resolve();
    }

    this.isLoadingAgendamentos = true;
    return this.agendamentosService.getAgendamentosProfissional(this.currentUser.id).toPromise()
      .then(agendamentos => {
        console.log('🔍 Debug - Agendamentos carregados:', agendamentos);
        this.agendamentos = this.agendamentosService.ordenarPorData(agendamentos || [], true);
        this.aplicarFiltrosAgendamentos();
        this.calcularEstatisticasAgenda();
      })
      .catch(error => {
        console.error('Erro ao carregar agendamentos:', error);
        this.agendamentos = [];
        this.agendamentosFiltrados = [];
      })
      .finally(() => {
        this.isLoadingAgendamentos = false;
      });
  }

  // Abrir modal de agendamentos
  openModalAgendamentos(): void {
    this.showModalAgendamentos = true;
    this.loadAgendamentos();
  }

  // Fechar modal de agendamentos
  closeModalAgendamentos(): void {
    this.showModalAgendamentos = false;
  }

  // Confirmar agendamento
  confirmarAgendamento(agendamento: Agendamento): void {
    if (!agendamento.id) return;

    this.agendamentosService.confirmarAgendamento(agendamento.id.toString()).subscribe({
      next: (agendamentoAtualizado) => {
        // Atualizar na lista local
        const index = this.agendamentos.findIndex(a => a.id === agendamento.id);
        if (index !== -1) {
          this.agendamentos[index] = agendamentoAtualizado;
        }
        this.aplicarFiltrosAgendamentos();
        this.calcularEstatisticasAgenda();
        this.showSuccessMessage('Agendamento confirmado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao confirmar agendamento:', error);
        this.showErrorMessage('Erro ao confirmar agendamento. Tente novamente.');
      }
    });
  }

  // Cancelar agendamento
  cancelarAgendamento(agendamento: Agendamento): void {
    if (!agendamento.id) return;

    const confirmacao = confirm('Tem certeza que deseja cancelar este agendamento?');
    if (!confirmacao) return;

    this.agendamentosService.cancelarAgendamento(agendamento.id.toString(), 'Cancelado pelo profissional').subscribe({
      next: (agendamentoAtualizado) => {
        // Atualizar na lista local
        const index = this.agendamentos.findIndex(a => a.id === agendamento.id);
        if (index !== -1) {
          this.agendamentos[index] = agendamentoAtualizado;
        }
        this.aplicarFiltrosAgendamentos();
        this.calcularEstatisticasAgenda();
        this.showSuccessMessage('Agendamento cancelado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao cancelar agendamento:', error);
        this.showErrorMessage('Erro ao cancelar agendamento. Tente novamente.');
      }
    });
  }

  // Atualizar agendamento
  atualizarAgendamento(agendamento: Agendamento): void {
    // TODO: Implementar modal de edição de agendamento
    console.log('Atualizar agendamento:', agendamento);
    this.showInfoMessage('Funcionalidade de edição em desenvolvimento.');
  }

  // Ver detalhes do agendamento
  verDetalhesAgendamento(agendamento: Agendamento): void {
    // TODO: Implementar modal de detalhes
    console.log('Ver detalhes do agendamento:', agendamento);
  }

  // Formatação de agendamentos
  formatarDataAgendamento(data: string): string {
    return this.agendamentosService.formatarData(data);
  }

  formatarHorarioAgendamento(data: string): string {
    return this.agendamentosService.formatarHorario(data);
  }

  formatarDataHorarioAgendamento(data: string): string {
    return this.agendamentosService.formatarDataHorario(data);
  }

  isHojeAgendamento(data: string): boolean {
    return this.agendamentosService.isHoje(data);
  }

  isAmanhaAgendamento(data: string): boolean {
    return this.agendamentosService.isAmanha(data);
  }

  isProximoAgendamento(data: string): boolean {
    return this.agendamentosService.isProximo(data);
  }

  isPassadoAgendamento(data: string): boolean {
    return this.agendamentosService.isPassado(data);
  }

  getStatusClassAgendamento(status: string): string {
    return this.agendamentosService.getStatusClass(status);
  }

  getStatusTextAgendamento(status: string): string {
    return this.agendamentosService.getStatusText(status);
  }

  getStatusPagamentoClassAgendamento(status: string): string {
    return this.agendamentosService.getStatusPagamentoClass(status);
  }

  getStatusPagamentoTextAgendamento(status: string): string {
    return this.agendamentosService.getStatusPagamentoText(status);
  }

  // ===== FILTROS E ESTATÍSTICAS DA AGENDA =====

  // Aplicar todos os filtros de agendamentos
  aplicarFiltrosAgendamentos(): void {
    let agendamentosFiltrados = [...this.agendamentos];

    // Filtro por texto (busca)
    if (this.filtroAgendamentos.trim()) {
      const termo = this.filtroAgendamentos.toLowerCase();
      agendamentosFiltrados = agendamentosFiltrados.filter(agendamento =>
        agendamento.title?.toLowerCase().includes(termo) ||
        agendamento.cliente?.nome?.toLowerCase().includes(termo) ||
        agendamento.cliente?.name?.toLowerCase().includes(termo) ||
        agendamento.servico?.nome?.toLowerCase().includes(termo) ||
        agendamento.observacoes?.toLowerCase().includes(termo)
      );
    }

    // Filtro por data
    if (this.filtroDataInicio) {
      const dataInicio = new Date(this.filtroDataInicio);
      agendamentosFiltrados = agendamentosFiltrados.filter(agendamento => {
        if (!agendamento.startDateTime) return false;
        const dataAgendamento = new Date(agendamento.startDateTime as string);
        return dataAgendamento >= dataInicio;
      });
    }

    if (this.filtroDataFim) {
      const dataFim = new Date(this.filtroDataFim);
      dataFim.setHours(23, 59, 59, 999); // Incluir todo o dia
      agendamentosFiltrados = agendamentosFiltrados.filter(agendamento => {
        if (!agendamento.startDateTime) return false;
        const dataAgendamento = new Date(agendamento.startDateTime as string);
        return dataAgendamento <= dataFim;
      });
    }

    // Filtro por status
    if (this.filtroStatus) {
      agendamentosFiltrados = agendamentosFiltrados.filter(agendamento =>
        agendamento.status === this.filtroStatus
      );
    }

    // Filtro por status de pagamento
    if (this.filtroStatusPagamento) {
      agendamentosFiltrados = agendamentosFiltrados.filter(agendamento =>
        agendamento.statusPagamento === this.filtroStatusPagamento
      );
    }

    this.agendamentosFiltrados = agendamentosFiltrados;
  }

  // Filtrar agendamentos por data
  filtrarAgendamentosPorData(): void {
    this.aplicarFiltrosAgendamentos();
    this.calcularEstatisticasAgenda();
  }

  // Filtrar agendamentos por status
  filtrarAgendamentosPorStatus(): void {
    this.aplicarFiltrosAgendamentos();
    this.calcularEstatisticasAgenda();
  }

  // Filtrar agendamentos por status de pagamento
  filtrarAgendamentosPorStatusPagamento(): void {
    this.aplicarFiltrosAgendamentos();
    this.calcularEstatisticasAgenda();
  }

  // Calcular estatísticas da agenda
  calcularEstatisticasAgenda(): void {
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    this.agendamentosHoje = this.agendamentos.filter(agendamento =>
      agendamento.startDateTime && this.isHojeAgendamento(agendamento.startDateTime)
    );

    this.agendamentosAmanha = this.agendamentos.filter(agendamento =>
      agendamento.startDateTime && this.isAmanhaAgendamento(agendamento.startDateTime)
    );

    this.agendamentosPendentes = this.agendamentos.filter(agendamento =>
      agendamento.status === 'tentative'
    );

    this.receitaTotal = this.agendamentos
      .filter(agendamento => agendamento.status !== 'cancelled')
      .reduce((total, agendamento) => total + (agendamento.valor || 0), 0);
  }

  // Limpar todos os filtros da agenda
  limparFiltrosAgenda(): void {
    this.filtroAgendamentos = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.filtroStatus = '';
    this.filtroStatusPagamento = '';
    this.aplicarFiltrosAgendamentos();
    this.calcularEstatisticasAgenda();
  }

  // Inicializar filtros da agenda com valores padrão
  inicializarFiltrosAgenda(): void {
    const hoje = new Date();
    const proximaSemana = new Date();
    proximaSemana.setDate(hoje.getDate() + 7);

    this.filtroDataInicio = hoje.toISOString().split('T')[0];
    this.filtroDataFim = proximaSemana.toISOString().split('T')[0];
  }

  // ===== MÉTODOS AUXILIARES PARA TEMPLATE =====

  // Verificar se agendamento é hoje (com verificação de segurança)
  isHojeAgendamentoSafe(agendamento: Agendamento): boolean {
    return agendamento.startDateTime ? this.isHojeAgendamento(agendamento.startDateTime) : false;
  }

  // Verificar se agendamento é amanhã (com verificação de segurança)
  isAmanhaAgendamentoSafe(agendamento: Agendamento): boolean {
    return agendamento.startDateTime ? this.isAmanhaAgendamento(agendamento.startDateTime) : false;
  }

  // Verificar se agendamento é passado (com verificação de segurança)
  isPassadoAgendamentoSafe(agendamento: Agendamento): boolean {
    return agendamento.startDateTime ? this.isPassadoAgendamento(agendamento.startDateTime) : false;
  }

  // Formatar data do agendamento (com verificação de segurança)
  formatarDataAgendamentoSafe(agendamento: Agendamento): string {
    return agendamento.startDateTime ? this.formatarDataAgendamento(agendamento.startDateTime) : 'N/A';
  }

  // Formatar horário do agendamento (com verificação de segurança)
  formatarHorarioAgendamentoSafe(agendamento: Agendamento): string {
    return agendamento.startDateTime ? this.formatarHorarioAgendamento(agendamento.startDateTime) : 'N/A';
  }

  // Mensagens
  private showSuccessMessage(message: string): void {
    this.showNotification(message, 'success');
  }

  private showErrorMessage(message: string): void {
    this.showNotification(message, 'danger');
  }

  private showInfoMessage(message: string): void {
    this.showNotification(message, 'info');
  }

  private showNotification(message: string, type: string): void {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
  }

  // ===== VALIDADORES PERSONALIZADOS =====

  // Validador de nome
  nameValidator(control: AbstractControl): { [key: string]: any } | null {
    const name = control.value;
    if (!name) return null;

    const errors: any = {};
    if (name.length < 3) errors.nameTooShort = true;
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) errors.nameInvalidChars = true;
    if (name.trim().split(' ').length < 2) errors.nameNeedSurname = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador de força da senha
  passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    const errors: any = {};
    if (!hasMinLength) errors.passwordMinLength = true;
    if (!hasUpperCase) errors.passwordNoUpperCase = true;
    if (!hasLowerCase) errors.passwordNoLowerCase = true;
    if (!hasNumbers) errors.passwordNoNumbers = true;
    if (!hasSpecialChar) errors.passwordNoSpecialChar = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador de CPF
  cpfValidator(control: AbstractControl): { [key: string]: any } | null {
    const cpf = control.value;
    if (!cpf) return null;

    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return { cpfInvalidLength: true };
    if (!this.validarCPF(cpf)) return { cpfInvalid: true };

    return null;
  }

  // Validador de data de nascimento
  birthDateValidator(control: AbstractControl): { [key: string]: any } | null {
    const birthDate = control.value;
    if (!birthDate) return null;

    const date = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    const errors: any = {};
    if (isNaN(date.getTime())) errors.birthDateInvalid = true;
    if (age < 18 || (age === 18 && monthDiff < 0)) errors.birthDateTooYoung = true;
    if (age > 120) errors.birthDateTooOld = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador de celular
  cellValidator(control: AbstractControl): { [key: string]: any } | null {
    const cell = control.value;
    if (!cell) return null;

    const cleanCell = cell.replace(/\D/g, '');
    const errors: any = {};
    
    if (cleanCell.length !== 11) errors.cellInvalidLength = true;
    if (!/^[1-9]{2}[2-9][0-9]{8}$/.test(cleanCell)) errors.cellInvalidFormat = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador de endereço
  addressValidator(control: AbstractControl): { [key: string]: any } | null {
    const address = control.value;
    if (!address) return null;

    const errors: any = {};
    if (address.length < 10) errors.addressTooShort = true;
    if (!/^[a-zA-ZÀ-ÿ0-9\s,.-]+$/.test(address)) errors.addressInvalidChars = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador de especialidade
  especialidadeValidator(control: AbstractControl): { [key: string]: any } | null {
    const especialidade = control.value;
    if (!especialidade) return null;

    const errors: any = {};
    if (especialidade.length < 3) errors.especialidadeTooShort = true;
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(especialidade)) errors.especialidadeInvalidChars = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador de CRM/CNEC
  cnecValidator(control: AbstractControl): { [key: string]: any } | null {
    const cnec = control.value;
    if (!cnec) return null;

    const errors: any = {};
    if (cnec.length < 4) errors.cnecTooShort = true;
    if (!/^[0-9]+$/.test(cnec)) errors.cnecInvalidFormat = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // ===== FUNÇÕES DE VALIDAÇÃO EM TEMPO REAL =====

  // Validação em tempo real para todos os campos
  onFieldChange(fieldName: string): void {
    const control = this.novoProfissionalForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  // Validação de CPF em tempo real
  onCpfChange(event: any): void {
    this.formatarCPFInput(event);
    this.onFieldChange('cpf');
  }

  // Validação de celular em tempo real
  onCellChange(event: any): void {
    this.formatarCelularInput(event);
    this.onFieldChange('cell');
  }

  // Validação de senha em tempo real
  onPasswordChange(event: any): void {
    this.onFieldChange('senha');
  }

  // ===== FUNÇÕES DE FORMATAÇÃO =====

  // Formatar CPF automaticamente (para input)
  formatarCPFInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      event.target.value = value;
    }
  }

  // Formatar celular automaticamente (para input)
  formatarCelularInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      event.target.value = value;
    }
  }

  // ===== FUNÇÕES DE VALIDAÇÃO AUXILIARES =====

  // Validar CPF
  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let dv1 = resto < 2 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let dv2 = resto < 2 ? 0 : resto;

    return parseInt(cpf.charAt(9)) === dv1 && parseInt(cpf.charAt(10)) === dv2;
  }

  // Obter status da senha para feedback visual
  getPasswordStatus(): { valid: boolean, requirements: any } {
    const password = this.novoProfissionalForm.get('senha')?.value || '';
    
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const valid = Object.values(requirements).every(req => req === true);
    
    return { valid, requirements };
  }

  // Verificar se um campo é válido
  isFieldValid(fieldName: string): boolean {
    const control = this.novoProfissionalForm.get(fieldName);
    return control ? control.valid && control.touched : false;
  }

  // Verificar se um campo tem erro
  hasFieldError(fieldName: string): boolean {
    const control = this.novoProfissionalForm.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  // Controle de visualização de senha
  showPassword = false;

  // Alternar visualização da senha
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Obter mensagens de erro para campos específicos
  getErrorMessage(controlName: string): string {
    const control = this.novoProfissionalForm.get(controlName);
    if (control && control.errors && control.touched) {
      // Erros básicos
      if (control.errors['required']) {
        return 'Este campo é obrigatório';
      }
      
      // Erros de email
      if (control.errors['email']) {
        return 'Email inválido';
      }
      
      // Erros de nome
      if (control.errors['nameTooShort']) {
        return 'Nome deve ter pelo menos 3 caracteres';
      } else if (control.errors['nameInvalidChars']) {
        return 'Nome deve conter apenas letras e espaços';
      } else if (control.errors['nameNeedSurname']) {
        return 'Digite seu nome completo (nome e sobrenome)';
      }
      
      // Erros de CPF
      if (control.errors['cpfInvalidLength']) {
        return 'CPF deve ter 11 dígitos';
      } else if (control.errors['cpfInvalid']) {
        return 'CPF inválido';
      }
      
      // Erros de data de nascimento
      if (control.errors['birthDateInvalid']) {
        return 'Data de nascimento inválida';
      } else if (control.errors['birthDateTooYoung']) {
        return 'Profissional deve ter pelo menos 18 anos';
      } else if (control.errors['birthDateTooOld']) {
        return 'Data de nascimento inválida';
      }
      
      // Erros de celular
      if (control.errors['cellInvalidLength']) {
        return 'Celular deve ter 11 dígitos';
      } else if (control.errors['cellInvalidFormat']) {
        return 'Formato de celular inválido';
      }
      
      // Erros de endereço
      if (control.errors['addressTooShort']) {
        return 'Endereço deve ter pelo menos 10 caracteres';
      } else if (control.errors['addressInvalidChars']) {
        return 'Endereço contém caracteres inválidos';
      }
      
      // Erros de especialidade
      if (control.errors['especialidadeTooShort']) {
        return 'Especialidade deve ter pelo menos 3 caracteres';
      } else if (control.errors['especialidadeInvalidChars']) {
        return 'Especialidade deve conter apenas letras e espaços';
      }
      
      // Erros de CRM/CNEC
      if (control.errors['cnecTooShort']) {
        return 'CRM deve ter pelo menos 4 dígitos';
      } else if (control.errors['cnecInvalidFormat']) {
        return 'CRM deve conter apenas números';
      }
      
      // Erros de senha
      if (control.errors['passwordMinLength']) {
        return 'Senha deve ter pelo menos 8 caracteres';
      } else if (control.errors['passwordNoUpperCase']) {
        return 'Senha deve conter pelo menos 1 letra maiúscula';
      } else if (control.errors['passwordNoLowerCase']) {
        return 'Senha deve conter pelo menos 1 letra minúscula';
      } else if (control.errors['passwordNoNumbers']) {
        return 'Senha deve conter pelo menos 1 número';
      } else if (control.errors['passwordNoSpecialChar']) {
        return 'Senha deve conter pelo menos 1 caractere especial (!@#$%^&*...)';
      }
      
      // Erro de comprimento mínimo genérico
      if (control.errors['minlength']) {
        return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}
