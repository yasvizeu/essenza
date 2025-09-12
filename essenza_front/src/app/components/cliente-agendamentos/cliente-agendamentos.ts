import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AgendamentosService, Agendamento } from '../../services/agendamentos';
import { ServicosService, Servico } from '../../services/servicos';
import { AgendamentoModalComponent } from '../agendamento-modal/agendamento-modal';

@Component({
  selector: 'app-cliente-agendamentos',
  templateUrl: './cliente-agendamentos.html',
  styleUrl: './cliente-agendamentos.scss',
  imports: [CommonModule, FormsModule, AgendamentoModalComponent],
  standalone: true
})
export class ClienteAgendamentosComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  agendamentos: Agendamento[] = [];
  agendamentosConfirmados: Agendamento[] = [];
  agendamentosHistorico: Agendamento[] = [];
  servicos: Servico[] = [];
  servicosPagos: Servico[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';

  // Filtros
  filtroStatus = 'todos';
  filtroPeriodo = 'todos';

  // Estados
  showEmptyState = false;
  showServicos = false;
  showAgendamentoModal = false;
  showDetalhesModal = false;
  showEdicaoModal = false;
  selectedServicoParaAgendamento: Servico | null = null;
  selectedAgendamentoDetalhes: Agendamento | null = null;
  selectedAgendamentoParaEdicao: Agendamento | null = null;

  constructor(
    private authService: AuthService,
    private agendamentosService: AgendamentosService,
    private servicosService: ServicosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🔍 Debug - Inicializando componente ClienteAgendamentos');
    
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated() || !this.authService.isCliente()) {
      console.log('🔍 Debug - Usuário não autenticado ou não é cliente');
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    console.log('🔍 Debug - Usuário atual:', this.currentUser);
    this.loadAgendamentos();
    this.loadServicosPagos();
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  loadAgendamentos(): void {
    console.log('🔍 Debug - Carregando agendamentos para usuário:', this.currentUser);
    
    if (!this.currentUser?.id) {
      console.log('🔍 Debug - Usuário não encontrado');
      this.hasError = true;
      this.errorMessage = 'Usuário não encontrado';
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    this.agendamentosService.getAgendamentosCliente(this.currentUser.id).subscribe({
      next: (agendamentos) => {
        console.log('🔍 Debug - Agendamentos recebidos:', agendamentos);
        console.log('🔍 Debug - Chamando ordenarPorData...');
        this.agendamentos = this.agendamentosService.ordenarPorData(agendamentos, true);
        console.log('🔍 Debug - Agendamentos após ordenação:', this.agendamentos);
        this.agendamentosService.atualizarAgendamentosLocais(agendamentos);
        
        // Classificar agendamentos nas três seções
        this.classificarAgendamentos();
        
        console.log('🔍 Debug - Agendamentos processados:', this.agendamentos);
        console.log('🔍 Debug - Confirmados:', this.agendamentosConfirmados.length);
        console.log('🔍 Debug - Histórico:', this.agendamentosHistorico.length);
        
        // Verificar se há agendamentos
        if (this.agendamentos.length === 0) {
          console.log('🔍 Debug - Nenhum agendamento encontrado, mostrando estado vazio');
          this.showEmptyState = true;
          this.loadServicos();
        } else {
          console.log('🔍 Debug - Agendamentos encontrados, escondendo estado vazio');
          this.showEmptyState = false;
          this.showServicos = false;
        }
        
        console.log('🔍 Debug - Definindo isLoading como false');
        this.isLoading = false;
        console.log('🔍 Debug - Estado final - isLoading:', this.isLoading, 'showEmptyState:', this.showEmptyState, 'agendamentos.length:', this.agendamentos.length);
        
        // Forçar detecção de mudanças
        this.cdr.detectChanges();
        console.log('🔍 Debug - Detecção de mudanças forçada');
      },
      error: (error) => {
        console.error('🔍 Debug - Erro ao carregar agendamentos:', error);
        this.hasError = true;
        this.errorMessage = 'Erro ao carregar agendamentos. Tente novamente.';
        this.isLoading = false;
        this.showEmptyState = true;
        this.loadServicos();
      }
    });
  }

  loadServicos(): void {
    console.log('🔍 Debug - Carregando serviços');
    this.servicosService.getServicos().subscribe({
      next: (response) => {
        console.log('🔍 Debug - Serviços carregados:', response);
        this.servicos = response.data;
        this.showServicos = true;
      },
      error: (error) => {
        console.error('🔍 Debug - Erro ao carregar serviços:', error);
      }
    });
  }

  loadServicosPagos(): void {
    console.log('🔍 Debug - Carregando serviços pagos não agendados via API');
    
    if (!this.currentUser?.id) {
      console.log('🔍 Debug - Usuário não encontrado para carregar serviços pagos');
      return;
    }

    // Buscar agendamentos tentative com statusPagamento pago via API
    this.agendamentosService.getServicosPagosNaoAgendados(this.currentUser.id).subscribe({
      next: (agendamentos: any) => {
        console.log('🔍 Debug - Agendamentos tentative pagos recebidos da API:', agendamentos);
        console.log('🔍 Debug - Quantidade de agendamentos tentative:', agendamentos.length);
        
        // Converter para formato de serviços
        this.servicosPagos = agendamentos.map((agendamento: any) => ({
          id: agendamento.servico?.id || agendamento.servicoId || 0,
          nome: agendamento.servico?.nome || agendamento.title || 'Serviço',
          descricao: agendamento.servico?.descricao || agendamento.description || 'Descrição não disponível',
          preco: agendamento.valor || 0,
          duracao: agendamento.servico?.duracao || 60,
          categoria: 'servico',
          imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          agendamentoId: agendamento.id // ID do agendamento tentative para referência
        }));
        
        console.log('🔍 Debug - Serviços pagos processados:', this.servicosPagos);
        console.log('🔍 Debug - Quantidade de serviços pagos na interface:', this.servicosPagos.length);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('🔍 Debug - Erro ao carregar serviços pagos:', error);
        this.servicosPagos = [];
        this.cdr.detectChanges();
      }
    });
  }

  // Filtros
  onFiltroStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filtroStatus = target.value;
    this.aplicarFiltros();
  }

  onFiltroPeriodoChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filtroPeriodo = target.value;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    let agendamentosFiltrados = [...this.agendamentos];

    // Filtrar por status
    if (this.filtroStatus !== 'todos') {
      agendamentosFiltrados = this.agendamentosService.filtrarPorStatus(
        agendamentosFiltrados, 
        this.filtroStatus
      );
    }

    // Filtrar por período
    if (this.filtroPeriodo !== 'todos') {
      const hoje = new Date();
      let dataInicio: string;
      let dataFim: string;

      switch (this.filtroPeriodo) {
        case 'hoje':
          dataInicio = hoje.toISOString().split('T')[0];
          dataFim = hoje.toISOString().split('T')[0];
          break;
        case 'semana':
          dataInicio = hoje.toISOString().split('T')[0];
          const proximaSemana = new Date(hoje);
          proximaSemana.setDate(hoje.getDate() + 7);
          dataFim = proximaSemana.toISOString().split('T')[0];
          break;
        case 'mes':
          dataInicio = hoje.toISOString().split('T')[0];
          const proximoMes = new Date(hoje);
          proximoMes.setMonth(hoje.getMonth() + 1);
          dataFim = proximoMes.toISOString().split('T')[0];
          break;
        default:
          return;
      }

      agendamentosFiltrados = this.agendamentosService.filtrarPorPeriodo(
        agendamentosFiltrados,
        dataInicio,
        dataFim
      );
    }

    // Atualizar lista filtrada
    this.agendamentos = agendamentosFiltrados;
  }

  // Ações
  confirmarAgendamento(agendamento: Agendamento): void {
    if (!agendamento.id) return;

    this.agendamentosService.confirmarAgendamento(agendamento.id.toString()).subscribe({
      next: (agendamentoAtualizado) => {
        // Atualizar na lista local
        const index = this.agendamentos.findIndex(a => a.id === agendamento.id);
        if (index !== -1) {
          this.agendamentos[index] = agendamentoAtualizado;
        }
        this.showSuccessMessage('Agendamento confirmado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao confirmar agendamento:', error);
        this.showErrorMessage('Erro ao confirmar agendamento. Tente novamente.');
      }
    });
  }

  cancelarAgendamento(agendamento: Agendamento): void {
    if (!agendamento.id) return;

    const confirmacao = confirm('Tem certeza que deseja cancelar este agendamento?');
    if (!confirmacao) return;

    this.agendamentosService.cancelarAgendamento(agendamento.id.toString(), 'Cancelado pelo cliente').subscribe({
      next: (agendamentoAtualizado) => {
        // Atualizar na lista local
        const index = this.agendamentos.findIndex(a => a.id === agendamento.id);
        if (index !== -1) {
          this.agendamentos[index] = agendamentoAtualizado;
        }
        this.showSuccessMessage('Agendamento cancelado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao cancelar agendamento:', error);
        this.showErrorMessage('Erro ao cancelar agendamento. Tente novamente.');
      }
    });
  }

  reagendarAgendamento(agendamento: Agendamento): void {
    // Buscar o serviço correspondente ao agendamento
    const servico = this.servicos.find(s => s.nome === agendamento.servicoNome || s.id === agendamento.servicoId);
    
    if (servico) {
      // Abrir modal de agendamento com o serviço selecionado
      this.selectedServicoParaAgendamento = servico;
      this.showAgendamentoModal = true;
    } else {
      this.showErrorMessage('Serviço não encontrado para reagendamento.');
    }
  }

  verDetalhesAgendamento(agendamento: Agendamento): void {
    this.selectedAgendamentoDetalhes = agendamento;
    this.showDetalhesModal = true;
    console.log('Ver detalhes do agendamento:', agendamento);
  }

  closeDetalhesModal(): void {
    this.showDetalhesModal = false;
    this.selectedAgendamentoDetalhes = null;
  }

  // Navegação
  goToNovoAgendamento(): void {
    // Navegar para a página de serviços
    this.router.navigate(['/servicos']);
  }

  openAgendamentoModal(servico: Servico): void {
    if (!this.authService.isAuthenticated() || !this.authService.isCliente()) {
      this.showErrorMessage('Você precisa estar logado como cliente para agendar.');
      return;
    }

    this.selectedServicoParaAgendamento = servico;
    this.showAgendamentoModal = true;
  }

  abrirModalAgendamento(servico: Servico): void {
    console.log('🔍 Debug - Abrindo modal de agendamento para:', servico.nome);
    
    if (!this.authService.isAuthenticated() || !this.authService.isCliente()) {
      this.showErrorMessage('Você precisa estar logado como cliente para agendar.');
      return;
    }

    this.selectedServicoParaAgendamento = servico;
    this.showAgendamentoModal = true;
    console.log('🔍 Debug - Modal de agendamento aberto');
  }

  closeAgendamentoModal(): void {
    this.showAgendamentoModal = false;
    this.selectedServicoParaAgendamento = null;
  }

  onAgendamentoCriado(agendamento: any): void {
    console.log('🔍 Debug - Agendamento criado:', agendamento);
    this.showSuccessMessage('Agendamento criado com sucesso!');
    
    // Se estamos agendando um serviço pago (agendamento tentative)
    if (this.selectedServicoParaAgendamento && (this.selectedServicoParaAgendamento as any).agendamentoId) {
      const agendamentoId = (this.selectedServicoParaAgendamento as any).agendamentoId;
      console.log('🔍 Debug - Criando novo agendamento confirmed para serviço pago');
      
      // Criar novo agendamento confirmed em vez de atualizar
      const dataHora = new Date(`${agendamento.data}T${agendamento.horario}:00`);
      const dataHoraFim = new Date(dataHora.getTime() + 60 * 60 * 1000); // 1 hora depois
      
      const novoAgendamento = {
        title: this.selectedServicoParaAgendamento.nome,
        description: this.selectedServicoParaAgendamento.descricao || '',
        startDateTime: dataHora.toISOString(),
        endDateTime: dataHoraFim.toISOString(),
        clienteId: Number(this.currentUser.id),
        profissionalId: Number(agendamento.profissionalId),
        servicoId: Number(this.selectedServicoParaAgendamento.id),
        status: 'confirmed',
        statusPagamento: 'pago',
        valor: Number(this.selectedServicoParaAgendamento.preco),
        observacoes: agendamento.observacoes || ''
      };
      
      console.log('🔍 Debug - Criando novo agendamento confirmed:', novoAgendamento);
      
      this.agendamentosService.criarAgendamentoCompleto(novoAgendamento).subscribe({
        next: (agendamentoCriado) => {
          console.log('🔍 Debug - Novo agendamento confirmed criado:', agendamentoCriado);
          
          // Tentar remover o agendamento tentative (se existir)
          this.removerAgendamentoTentative(agendamentoId);
          
          this.recarregarDados();
        },
        error: (error) => {
          console.error('🔍 Debug - Erro ao criar agendamento confirmed:', error);
          console.error('🔍 Debug - Status:', error.status);
          console.error('🔍 Debug - Error details:', error.error);
          console.error('🔍 Debug - Dados enviados:', novoAgendamento);
          this.recarregarDados();
        }
      });
    } else {
      // Agendamento novo - recarregar dados
      this.recarregarDados();
    }
    
    // Fechar modal
    this.closeAgendamentoModal();
  }

  // Recarregar todos os dados
  private recarregarDados(): void {
    console.log('🔍 Debug - Recarregando dados...');
    this.loadAgendamentos();
    this.loadServicosPagos();
    this.cdr.detectChanges();
    console.log('🔍 Debug - Dados recarregados');
  }

  // Remover agendamento tentative (opcional)
  private removerAgendamentoTentative(agendamentoId: string | number): void {
    console.log('🔍 Debug - Tentando remover agendamento tentative ID:', agendamentoId);
    
    // Tentar remover o agendamento tentative (não é crítico se falhar)
    this.agendamentosService.removerAgendamento(agendamentoId).subscribe({
      next: (response) => {
        console.log('🔍 Debug - Agendamento tentative removido com sucesso:', response);
      },
      error: (error) => {
        console.log('🔍 Debug - Erro ao remover agendamento tentative:', error);
        console.log('🔍 Debug - Status:', error.status);
        console.log('🔍 Debug - Message:', error.message);
      }
    });
  }

  // Classificar agendamentos nas três seções
  classificarAgendamentos(): void {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    this.agendamentosConfirmados = [];
    this.agendamentosHistorico = [];
    
    this.agendamentos.forEach(agendamento => {
      const dataAgendamento = this.getAgendamentoDateTime(agendamento);
      
      // Agendamentos confirmados (futuros com data/hora definida)
      if (agendamento.status === 'confirmed' && dataAgendamento) {
        const data = new Date(dataAgendamento);
        data.setHours(0, 0, 0, 0);
        
        if (data >= hoje) {
          this.agendamentosConfirmados.push(agendamento);
        } else {
          // Agendamento confirmado no passado vai para histórico
          this.agendamentosHistorico.push(agendamento);
        }
      }
      // Histórico (passados, cancelados, completados)
      else if (
        agendamento.status === 'cancelled' || 
        (agendamento as any).status === 'completed' ||
        (dataAgendamento && new Date(new Date(dataAgendamento).setHours(0, 0, 0, 0)).getTime() < hoje.getTime())
      ) {
        this.agendamentosHistorico.push(agendamento);
      }
    });
    
    // Ordenar confirmados por data (mais próximos primeiro)
    this.agendamentosConfirmados.sort((a, b) => {
      const dataA = this.getAgendamentoDateTime(a);
      const dataB = this.getAgendamentoDateTime(b);
      if (!dataA || !dataB) return 0;
      return new Date(dataA).getTime() - new Date(dataB).getTime();
    });
    
    // Ordenar histórico por data (mais recentes primeiro)
    this.agendamentosHistorico.sort((a, b) => {
      const dataA = this.getAgendamentoDateTime(a);
      const dataB = this.getAgendamentoDateTime(b);
      if (!dataA || !dataB) return 0;
      return new Date(dataB).getTime() - new Date(dataA).getTime();
    });
    
    console.log('🔍 Debug - Agendamentos confirmados:', this.agendamentosConfirmados.length);
    console.log('🔍 Debug - Agendamentos histórico:', this.agendamentosHistorico.length);
  }

  // Verificar se pode editar agendamento (até 24h antes)
  podeEditarAgendamento(agendamento: Agendamento): boolean {
    const dataAgendamento = this.getAgendamentoDateTime(agendamento);
    if (!dataAgendamento) return false;
    
    const data = new Date(dataAgendamento);
    const agora = new Date();
    const diferencaHoras = (data.getTime() - agora.getTime()) / (1000 * 60 * 60);
    
    return diferencaHoras > 24 && agendamento.status === 'confirmed';
  }

  // Verificar se pode cancelar agendamento (até 24h antes)
  podeCancelarAgendamento(agendamento: Agendamento): boolean {
    const dataAgendamento = this.getAgendamentoDateTime(agendamento);
    if (!dataAgendamento) return false;
    
    const data = new Date(dataAgendamento);
    const agora = new Date();
    const diferencaHoras = (data.getTime() - agora.getTime()) / (1000 * 60 * 60);
    
    return diferencaHoras > 24 && agendamento.status === 'confirmed';
  }

  // Editar agendamento
  editarAgendamento(agendamento: Agendamento): void {
    if (!this.podeEditarAgendamento(agendamento)) {
      this.showErrorMessage('Você só pode editar agendamentos até 24h antes da data marcada.');
      return;
    }
    
    this.selectedAgendamentoParaEdicao = agendamento;
    this.showEdicaoModal = true;
    console.log('🔍 Debug - Abrindo modal de edição para:', agendamento);
  }

  // Fechar modal de edição
  closeEdicaoModal(): void {
    this.showEdicaoModal = false;
    this.selectedAgendamentoParaEdicao = null;
  }

  // Salvar edição de agendamento
  onAgendamentoEditado(agendamentoEditado: any): void {
    console.log('🔍 Debug - Agendamento editado:', agendamentoEditado);
    
    if (!agendamentoEditado.id) {
      this.showErrorMessage('ID do agendamento não encontrado.');
      return;
    }

    // Preparar dados para atualização
    const dadosAtualizacao = {
      startDateTime: `${agendamentoEditado.data}T${agendamentoEditado.horario}:00`,
      endDateTime: `${agendamentoEditado.data}T${this.calcularHorarioFim(agendamentoEditado.horario)}:00`,
      profissionalId: agendamentoEditado.profissionalId,
      observacoes: agendamentoEditado.observacoes,
      servicoId: agendamentoEditado.servicoId,
      servicoNome: agendamentoEditado.servicoNome
    };

    // Atualizar no backend
    this.agendamentosService.atualizarAgendamento(agendamentoEditado.id, dadosAtualizacao).subscribe({
      next: (agendamentoAtualizado) => {
        console.log('🔍 Debug - Agendamento atualizado no backend:', agendamentoAtualizado);
        this.showSuccessMessage('Agendamento atualizado com sucesso!');
        
        // Recarregar lista de agendamentos
        this.loadAgendamentos();
        
        // Fechar modal
        this.closeEdicaoModal();
      },
      error: (error) => {
        console.error('🔍 Debug - Erro ao atualizar agendamento:', error);
        this.showErrorMessage('Erro ao atualizar agendamento. Tente novamente.');
      }
    });
  }

  // Calcular horário de fim baseado no horário de início
  calcularHorarioFim(horarioInicio: string): string {
    const [hora, minuto] = horarioInicio.split(':').map(Number);
    const horaFim = hora + 1; // Assumindo 1 hora de duração
    return `${horaFim.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  }

  // Obter serviço para edição
  getServicoParaEdicao(): Servico | null {
    if (!this.selectedAgendamentoParaEdicao) return null;
    
    return {
      id: this.selectedAgendamentoParaEdicao.servicoId || 0,
      nome: this.selectedAgendamentoParaEdicao.servicoNome || '',
      descricao: this.selectedAgendamentoParaEdicao.description || '',
      preco: this.selectedAgendamentoParaEdicao.valor || 0,
      duracao: 60,
      categoria: '',
      imagem: ''
    } as Servico;
  }

  goToServico(servico: Servico): void {
    // TODO: Implementar navegação para detalhes do serviço
    console.log('Navegar para serviço:', servico);
  }

  // Métodos auxiliares para serviços
  getServicoImage(servico: Servico): string {
    if (servico.imagem) {
      return servico.imagem;
    }
    
    const servicoImages: { [key: string]: string } = {
      'Limpeza de Pele': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Tratamento Anti-idade': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Hidratação': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Peeling': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Acne': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    };

    for (const [key, image] of Object.entries(servicoImages)) {
      if (servico.nome.toLowerCase().includes(key.toLowerCase())) {
        return image;
      }
    }

    return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  }

  formatPrice(price: number | string): string {
    return this.servicosService.formatPrice(price);
  }

  formatDuration(minutes: number): string {
    return this.servicosService.formatDuration(minutes);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  // Método para forçar recarregamento
  refreshAgendamentos(): void {
    console.log('🔍 Debug - Forçando recarregamento de agendamentos');
    this.isLoading = true;
    this.hasError = false;
    this.loadAgendamentos();
  }

  // Método para debug
  debugInfo(): void {
    console.log('🔍 Debug - Informações do componente:');
    console.log('- isLoading:', this.isLoading);
    console.log('- hasError:', this.hasError);
    console.log('- errorMessage:', this.errorMessage);
    console.log('- currentUser:', this.currentUser);
    console.log('- agendamentos.length:', this.agendamentos.length);
    console.log('- showEmptyState:', this.showEmptyState);
    console.log('- showServicos:', this.showServicos);
    console.log('- servicos.length:', this.servicos.length);
  }

  // Método para simular dados de agendamentos
  simulateAgendamentos(): void {
    console.log('🔍 Debug - Simulando dados de agendamentos');
    this.agendamentos = [
      {
        id: '1',
        title: 'Limpeza de Pele Profunda',
        description: 'Tratamento facial completo',
        start: {
          dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        servicoId: 1,
        servicoNome: 'Limpeza de Pele Profunda',
        clienteId: this.currentUser?.id || 1,
        clienteNome: this.currentUser?.nome || 'Cliente Teste',
        profissionalId: 1,
        profissionalNome: 'Dr. Ana Silva',
        valor: 120,
        observacoes: 'Primeira sessão',
        status: 'confirmed',
        statusPagamento: 'pago'
      }
    ];
    this.isLoading = false;
    this.hasError = false;
    this.showEmptyState = false;
    this.showServicos = false;
    
    // Forçar detecção de mudanças
    this.cdr.detectChanges();
    console.log('🔍 Debug - Simulação concluída, detecção de mudanças forçada');
  }

  // Formatação
  formatarData(data: string): string {
    return this.agendamentosService.formatarData(data);
  }

  formatarHorario(data: string): string {
    return this.agendamentosService.formatarHorario(data);
  }

  formatarDataHorario(data: string): string {
    return this.agendamentosService.formatarDataHorario(data);
  }

  isHoje(data: string): boolean {
    return this.agendamentosService.isHoje(data);
  }

  isAmanha(data: string): boolean {
    return this.agendamentosService.isAmanha(data);
  }

  isProximo(data: string): boolean {
    return this.agendamentosService.isProximo(data);
  }

  isPassado(data: string): boolean {
    return this.agendamentosService.isPassado(data);
  }

  // Métodos auxiliares para template
  getAgendamentoDateTime(agendamento: Agendamento): string {
    const dateTime = agendamento.start?.dateTime ?? agendamento.startDateTime ?? '';
    console.log('🔍 Debug - getAgendamentoDateTime:', dateTime, 'para agendamento:', agendamento.id);
    return dateTime;
  }

  isHojeSafe(agendamento: Agendamento): boolean {
    const dateTime = this.getAgendamentoDateTime(agendamento);
    return dateTime ? this.isHoje(dateTime) : false;
  }

  isAmanhaSafe(agendamento: Agendamento): boolean {
    const dateTime = this.getAgendamentoDateTime(agendamento);
    return dateTime ? this.isAmanha(dateTime) : false;
  }

  isPassadoSafe(agendamento: Agendamento): boolean {
    const dateTime = this.getAgendamentoDateTime(agendamento);
    return dateTime ? this.isPassado(dateTime) : false;
  }

  getStatusClass(status: string): string {
    return this.agendamentosService.getStatusClass(status);
  }

  getStatusText(status: string): string {
    return this.agendamentosService.getStatusText(status);
  }

  getStatusPagamentoClass(status: string): string {
    return this.agendamentosService.getStatusPagamentoClass(status);
  }

  getStatusPagamentoText(status: string): string {
    return this.agendamentosService.getStatusPagamentoText(status);
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
}