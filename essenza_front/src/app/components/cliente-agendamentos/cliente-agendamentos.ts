import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AgendamentosService, Agendamento } from '../../services/agendamentos';
import { ServicosService, Servico } from '../../services/servicos';
import { AgendamentoModalComponent } from '../agendamento-modal/agendamento-modal';
import { EditarAgendamentoModalComponent } from '../editar-agendamento-modal/editar-agendamento-modal';

@Component({
  selector: 'app-cliente-agendamentos',
  templateUrl: './cliente-agendamentos.html',
  styleUrl: './cliente-agendamentos.scss',
  imports: [CommonModule, FormsModule, AgendamentoModalComponent, EditarAgendamentoModalComponent],
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
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated() || !this.authService.isCliente()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    this.loadAgendamentos();
    this.loadServicosPagos();
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  loadAgendamentos(): void {
    if (!this.currentUser?.id) {
      this.hasError = true;
      this.errorMessage = 'Usuário não encontrado';
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    this.agendamentosService.getAgendamentosCliente(this.currentUser.id).subscribe({
      next: (agendamentos) => {
        this.agendamentos = this.agendamentosService.ordenarPorData(agendamentos, true);
        this.agendamentosService.atualizarAgendamentosLocais(agendamentos);
        
        // Classificar agendamentos nas três seções
        this.classificarAgendamentos();
        
        // Verificar se há agendamentos
        if (this.agendamentos.length === 0) {
          this.showEmptyState = true;
          this.loadServicos();
        } else {
          this.showEmptyState = false;
          this.showServicos = false;
        }
        
        this.isLoading = false;
        
        // Forçar detecção de mudanças
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar agendamentos:', error);
        this.hasError = true;
        this.errorMessage = 'Erro ao carregar agendamentos. Tente novamente.';
        this.isLoading = false;
        this.showEmptyState = true;
        this.loadServicos();
      }
    });
  }

  loadServicos(): void {
    this.servicosService.getServicos().subscribe({
      next: (response) => {
        this.servicos = response.data;
        this.showServicos = true;
      },
      error: (error) => {
        console.error('Erro ao carregar serviços:', error);
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
          id: agendamento.id || 0,
          nome: agendamento.nome || 'Serviço',
          descricao: agendamento.descricao || 'Descrição não disponível',
          preco: agendamento.preco || 0,
          duracao: agendamento.duracao || 60,
          categoria: agendamento.categoria || 'servico',
          imagem: agendamento.imagem || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          agendamentoId: agendamento.agendamentoId // ID do agendamento tentative para referência
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
      console.log('🔍 Debug - Confirmando agendamento pago ID:', agendamentoId);
      
      // Usar o novo endpoint para confirmar agendamento pago
      const dataHora = new Date(`${agendamento.data}T${agendamento.horario}:00`);
      const dataHoraFim = new Date(dataHora.getTime() + 60 * 60 * 1000); // 1 hora depois
      
      this.agendamentosService.confirmarAgendamentoPago(
        agendamentoId,
        dataHora.toISOString(),
        dataHoraFim.toISOString(),
        Number(agendamento.profissionalId)
      ).subscribe({
        next: (agendamentoConfirmado) => {
          console.log('🔍 Debug - Agendamento pago confirmado:', agendamentoConfirmado);
          this.showSuccessMessage('Agendamento confirmado com sucesso!');
          // Remover imediatamente o card do serviço pago da seção amarela
          this.servicosPagos = this.servicosPagos.filter((s: any) => s.agendamentoId !== agendamentoId);
          // Adicionar de forma otimista aos confirmados
          if (agendamentoConfirmado) {
            this.agendamentosConfirmados = [agendamentoConfirmado as any, ...this.agendamentosConfirmados];
            // Atualizar fonte única e reclassificar para refletir no template
            this.agendamentos = [agendamentoConfirmado as any, ...this.agendamentos];
            this.classificarAgendamentos();
            this.cdr.detectChanges();
          }
          // Sincronizar com backend
          this.recarregarDados();
        },
        error: (error) => {
          console.error('🔍 Debug - Erro ao confirmar agendamento pago:', error);
          console.error('🔍 Debug - Status:', error.status);
          console.error('🔍 Debug - Error details:', error.error);
          // Se o endpoint não existir (404), tentar confirmar via atualização (PUT)
          if (error?.status === 404) {
            const dataHora = new Date(`${agendamento.data}T${agendamento.horario}:00`);
            const dataHoraFim = new Date(dataHora.getTime() + 60 * 60 * 1000);

            const payloadAtualizacao: any = {
              startDateTime: dataHora.toISOString(),
              endDateTime: dataHoraFim.toISOString(),
              profissionalId: Number(agendamento.profissionalId),
              status: 'confirmed'
            };

            this.agendamentosService.atualizarAgendamento(agendamentoId, payloadAtualizacao).subscribe({
              next: (agendamentoAtualizado) => {
                console.log('🔍 Debug - Agendamento confirmado via PUT update:', agendamentoAtualizado);
                this.showSuccessMessage('Agendamento confirmado com sucesso!');
                // Remover cartão da seção amarela
                this.servicosPagos = this.servicosPagos.filter((s: any) => s.agendamentoId !== agendamentoId);
                // Adicionar de forma otimista aos confirmados
                this.agendamentosConfirmados = [agendamentoAtualizado as any, ...this.agendamentosConfirmados];
                // Atualizar fonte única e reclassificar
                this.agendamentos = [agendamentoAtualizado as any, ...this.agendamentos];
                this.classificarAgendamentos();
                this.cdr.detectChanges();
                this.recarregarDados();
              },
              error: (errUpdate) => {
                console.error('🔍 Debug - Erro ao confirmar via PUT update:', errUpdate);
                // Fallback final: tentar criar novo agendamento
                this.criarNovoAgendamentoFallback(agendamento);
              }
            });
            return;
          }

          // Outros erros: fallback de criação
          this.criarNovoAgendamentoFallback(agendamento);
        }
      });
    } else {
      // Agendamento novo - recarregar dados
      this.recarregarDados();
    }
    
    // Fechar modal
    this.closeAgendamentoModal();
  }

  // Fallback para criar novo agendamento se a confirmação falhar
  private criarNovoAgendamentoFallback(agendamento: any): void {
    console.log('🔍 Debug - Executando fallback: criando novo agendamento');
    
    // Garantir que temos o serviço selecionado para montar o payload
    if (!this.selectedServicoParaAgendamento) {
      this.showErrorMessage('Não foi possível identificar o serviço para criar o agendamento. Tente novamente.');
      return;
    }

    const dataHora = new Date(`${agendamento.data}T${agendamento.horario}:00`);
    const dataHoraFim = new Date(dataHora.getTime() + 60 * 60 * 1000);
    
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
    
    this.agendamentosService.criarAgendamentoCompleto(novoAgendamento).subscribe({
      next: (agendamentoCriado) => {
        console.log('🔍 Debug - Novo agendamento criado via fallback:', agendamentoCriado);
        // Remover imediatamente o card do serviço pago (se existir referência)
        const pagoId = (this.selectedServicoParaAgendamento as any)?.agendamentoId;
        if (pagoId) {
          this.servicosPagos = this.servicosPagos.filter((s: any) => s.agendamentoId !== pagoId);
        }
        // Adicionar de forma otimista aos confirmados
        if (agendamentoCriado) {
          this.agendamentosConfirmados = [agendamentoCriado as any, ...this.agendamentosConfirmados];
        }
        // Sincronizar com backend
        this.recarregarDados();
      },
      error: (error) => {
        console.error('🔍 Debug - Erro no fallback:', error);
        this.showErrorMessage('Erro ao confirmar agendamento. Tente novamente.');
        this.recarregarDados();
      }
    });
  }

  // Recarregar todos os dados
  private recarregarDados(): void {
    console.log('🔍 Debug - Recarregando dados...');
    this.loadAgendamentos();
    this.loadServicosPagos();
    this.cdr.detectChanges();
    console.log('🔍 Debug - Dados recarregados');
  }


  // Método para editar agendamento existente
  editarAgendamento(agendamento: Agendamento): void {
    if (!this.agendamentosService.podeEditarAgendamento(agendamento.startDateTime || '')) {
      this.showErrorMessage('Não é possível editar agendamentos com menos de 24 horas de antecedência.');
      return;
    }

    this.selectedAgendamentoParaEdicao = agendamento;
    this.showEdicaoModal = true;
  }

  // Método para confirmar edição de agendamento
  confirmarEdicaoAgendamento(dadosEdicao: any): void {
    if (!this.selectedAgendamentoParaEdicao) return;

    this.isLoading = true;
    this.agendamentosService.atualizarAgendamento(
      this.selectedAgendamentoParaEdicao.id!,
      dadosEdicao
    ).subscribe({
      next: (agendamentoAtualizado) => {
        console.log('Agendamento atualizado com sucesso:', agendamentoAtualizado);
        this.isLoading = false;
        this.showEdicaoModal = false;
        this.selectedAgendamentoParaEdicao = null;
        this.loadAgendamentos(); // Recarregar lista
        this.showSuccessMessage('Agendamento atualizado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao atualizar agendamento:', error);
        this.isLoading = false;
        this.showErrorMessage('Erro ao atualizar agendamento. Tente novamente.');
      }
    });
  }

  // Método para lidar com agendamento editado
  onAgendamentoEditado(agendamentoEditado: any): void {
    console.log('Agendamento editado:', agendamentoEditado);
    this.showSuccessMessage('Agendamento editado com sucesso!');
    this.loadAgendamentos();
  }

  // Método para agendar serviço pago (usando o novo endpoint)
  agendarServicoPago(servico: any): void {
    if (!this.currentUser || this.currentUser.tipo !== 'cliente') {
      this.showErrorMessage('Você precisa estar logado como cliente para agendar.');
      return;
    }

    this.selectedServicoParaAgendamento = servico;
    this.showAgendamentoModal = true;
  }

  // Métodos auxiliares para o template
  podeEditarAgendamento(agendamento: Agendamento): boolean {
    return this.agendamentosService.podeEditarAgendamento(agendamento.startDateTime || '');
  }

  podeCancelarAgendamento(agendamento: Agendamento): boolean {
    // Pode cancelar se não passou e não é cancelled
    return !this.agendamentosService.isPassado(agendamento.startDateTime || '') && 
           agendamento.status !== 'cancelled';
  }

  formatarData(data: string): string {
    return this.agendamentosService.formatarData(data);
  }

  formatarHorario(data: string): string {
    return this.agendamentosService.formatarHorario(data);
  }

  isHoje(data: string): boolean {
    return this.agendamentosService.isHoje(data);
  }

  isAmanha(data: string): boolean {
    return this.agendamentosService.isAmanha(data);
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




  // Fechar modal de edição
  closeEdicaoModal(): void {
    this.showEdicaoModal = false;
    this.selectedAgendamentoParaEdicao = null;
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

  // Métodos auxiliares para o template
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

  isPassado(data: string): boolean {
    return this.agendamentosService.isPassado(data);
  }
}