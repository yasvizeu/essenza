import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamentosService, Agendamento } from '../../services/agendamentos';

@Component({
  selector: 'app-editar-agendamento-modal',
  templateUrl: './editar-agendamento-modal.html',
  styleUrl: './editar-agendamento-modal.scss',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class EditarAgendamentoModalComponent implements OnInit, OnDestroy {
  @Input() agendamento: Agendamento | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() agendamentoEditado = new EventEmitter<any>();

  // Estados
  hasError = false;
  errorMessage = '';
  isLoading = false;

  // Formulário de edição
  dataSelecionada = '';
  horarioSelecionado = '';
  profissionalSelecionado = '';
  observacoes = '';

  // Dados para o formulário
  horariosDisponiveis = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  profissionaisDisponiveis = [
    { id: 1, nome: 'Dr. Ana Silva' },
    { id: 2, nome: 'Dra. Maria Santos' },
    { id: 3, nome: 'Dr. João Oliveira' }
  ];

  constructor(
    private agendamentosService: AgendamentosService
  ) {}

  ngOnInit(): void {
    if (this.agendamento) {
      this.initializeForm();
    }
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  ngOnChanges(): void {
    if (this.agendamento && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (!this.agendamento) return;

    // Extrair data e hora do agendamento
    const dataHora = new Date(this.agendamento.startDateTime || '');
    this.dataSelecionada = dataHora.toISOString().split('T')[0];
    this.horarioSelecionado = dataHora.toTimeString().slice(0, 5);
    this.profissionalSelecionado = this.agendamento.profissionalId?.toString() || '';
    this.observacoes = this.agendamento.observacoes || '';
  }

  closeModal(): void {
    this.isOpen = false;
    this.hasError = false;
    this.errorMessage = '';
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.agendamento || !this.isFormValid()) {
      this.showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    // Verificar disponibilidade antes de confirmar
    const dataHora = new Date(`${this.dataSelecionada}T${this.horarioSelecionado}:00`);
    const dataHoraFim = new Date(dataHora.getTime() + 60 * 60 * 1000); // 1 hora depois

    this.agendamentosService.verificarDisponibilidade(
      Number(this.profissionalSelecionado),
      dataHora.toISOString(),
      dataHoraFim.toISOString(),
      this.agendamento.id
    ).subscribe({
      next: (response) => {
        if (response.disponivel) {
          this.confirmarEdicao(dataHora, dataHoraFim);
        } else {
          this.isLoading = false;
          this.showError('Horário não disponível para o profissional selecionado.');
        }
      },
      error: (error) => {
        console.error('Erro ao verificar disponibilidade:', error);
        this.isLoading = false;
        this.showError('Erro ao verificar disponibilidade. Tente novamente.');
      }
    });
  }

  private confirmarEdicao(dataHora: Date, dataHoraFim: Date): void {
    const dadosEdicao = {
      startDateTime: dataHora.toISOString(),
      endDateTime: dataHoraFim.toISOString(),
      profissionalId: Number(this.profissionalSelecionado),
      observacoes: this.observacoes
    };

    this.agendamentosService.atualizarAgendamento(
      this.agendamento!.id!,
      dadosEdicao
    ).subscribe({
      next: (agendamentoAtualizado) => {
        console.log('Agendamento editado com sucesso:', agendamentoAtualizado);
        this.isLoading = false;
        this.agendamentoEditado.emit(agendamentoAtualizado);
        this.closeModal();
      },
      error: (error) => {
        console.error('Erro ao editar agendamento:', error);
        this.isLoading = false;
        this.showError('Erro ao editar agendamento. Tente novamente.');
      }
    });
  }

  isFormValid(): boolean {
    return !!(this.dataSelecionada && this.horarioSelecionado && this.profissionalSelecionado);
  }

  private showError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
  }

  // Métodos auxiliares para o template
  formatarData(data: string): string {
    return this.agendamentosService.formatarData(data);
  }

  formatarHorario(data: string): string {
    return this.agendamentosService.formatarHorario(data);
  }

  getTempoRestante(): string {
    if (!this.agendamento?.startDateTime) return '';
    return this.agendamentosService.getTempoRestanteEdicao(this.agendamento.startDateTime);
  }

  getMinDate(): string {
    // Data mínima é hoje
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  }
}
