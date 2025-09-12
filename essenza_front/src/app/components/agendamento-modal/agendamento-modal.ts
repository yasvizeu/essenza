import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicosService, Servico } from '../../services/servicos';
import { CartService } from '../../services/cart';
import { AgendamentosService } from '../../services/agendamentos';


@Component({
  selector: 'app-agendamento-modal',
  templateUrl: './agendamento-modal.html',
  styleUrl: './agendamento-modal.scss',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class AgendamentoModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() servico: Servico | null = null;
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() agendamentoOriginal: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() agendamentoCriado = new EventEmitter<any>();

  // Estados
  hasError = false;
  errorMessage = '';

  // Formulário de agendamento
  dataSelecionada = '';
  horarioSelecionado = '';
  profissionalSelecionado = '';
  observacoes = '';

  // Dados para o formulário
  horariosDisponiveis = [
    '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  profissionaisDisponiveis = [
    { id: 1, nome: 'Dr. Ana Silva' },
    { id: 2, nome: 'Dra. Maria Santos' },
    { id: 3, nome: 'Dr. João Oliveira' }
  ];

  constructor(
    private servicosService: ServicosService,
    private cartService: CartService,
    private agendamentosService: AgendamentosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🔍 Modal inicializado:', { servico: this.servico, isOpen: this.isOpen, isEditMode: this.isEditMode });
    if (this.isEditMode && this.agendamentoOriginal) {
      this.preencherFormularioEdicao();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('🔍 Mudanças detectadas:', changes);
    if (changes['isEditMode'] && this.isEditMode && this.agendamentoOriginal) {
      this.preencherFormularioEdicao();
    }
  }

  preencherFormularioEdicao(): void {
    if (!this.agendamentoOriginal) return;
    
    const dataAgendamento = this.agendamentoOriginal.startDateTime || this.agendamentoOriginal.start?.dateTime;
    if (dataAgendamento) {
      const data = new Date(dataAgendamento);
      this.dataSelecionada = data.toISOString().split('T')[0];
      this.horarioSelecionado = data.toTimeString().slice(0, 5);
    }
    
    if (this.agendamentoOriginal.profissionalId) {
      this.profissionalSelecionado = this.agendamentoOriginal.profissionalId.toString();
    }
    
    if (this.agendamentoOriginal.observacoes) {
      this.observacoes = this.agendamentoOriginal.observacoes;
    }
    
    console.log('🔍 Debug - Formulário preenchido para edição:', {
      dataSelecionada: this.dataSelecionada,
      horarioSelecionado: this.horarioSelecionado,
      profissionalSelecionado: this.profissionalSelecionado,
      observacoes: this.observacoes
    });
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }


  closeModal(): void {
    this.hasError = false;
    this.errorMessage = '';
    this.resetForm();
    this.close.emit();
  }

  resetForm(): void {
    this.dataSelecionada = '';
    this.horarioSelecionado = '';
    this.profissionalSelecionado = '';
    this.observacoes = '';
  }

  getMinDate(): string {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  }

  podeAgendar(): boolean {
    return !!(this.dataSelecionada && this.horarioSelecionado && this.profissionalSelecionado);
  }

  confirmarAgendamento(): void {
    if (!this.podeAgendar() || !this.servico) {
      this.showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (this.isEditMode && this.agendamentoOriginal) {
      // Modo de edição
      const agendamentoEditado = {
        id: this.agendamentoOriginal.id,
        servicoId: this.servico.id,
        servicoNome: this.servico.nome,
        data: this.dataSelecionada,
        horario: this.horarioSelecionado,
        profissionalId: parseInt(this.profissionalSelecionado),
        observacoes: this.observacoes,
        status: this.agendamentoOriginal.status,
        statusPagamento: this.agendamentoOriginal.statusPagamento
      };

      console.log('🔍 Debug - Editando agendamento:', agendamentoEditado);
      this.agendamentoCriado.emit(agendamentoEditado);
    } else {
      // Modo de criação
      const agendamento = {
        servicoId: this.servico.id,
        servicoNome: this.servico.nome,
        data: this.dataSelecionada,
        horario: this.horarioSelecionado,
        profissionalId: parseInt(this.profissionalSelecionado),
        observacoes: this.observacoes,
        status: 'tentative',
        statusPagamento: 'pago' // Já foi pago
      };

      console.log('🔍 Debug - Criando agendamento:', agendamento);
      this.agendamentoCriado.emit(agendamento);
    }

    this.closeModal();
  }

  private showError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
  }

  private showSuccess(message: string): void {
    // Criar notificação de sucesso
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      <i class="bi bi-check-circle me-2"></i>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Formatação
  formatarPreco(preco: number): string {
    return this.servicosService.formatPrice(preco);
  }

  formatarDuracao(minutes: number): string {
    return this.servicosService.formatDuration(minutes);
  }

  // Getters
  get servicoNome(): string {
    return this.servico?.nome || '';
  }

  get servicoPreco(): number {
    if (!this.servico?.preco) return 0;
    const numericPrice = typeof this.servico.preco === 'string' ? parseFloat(this.servico.preco) : this.servico.preco;
    return isNaN(numericPrice) ? 0 : numericPrice;
  }

  get servicoDuracao(): number {
    return this.servico?.duracao || 60;
  }

  get servicoDescricao(): string {
    return this.servico?.descricao || '';
  }

}
