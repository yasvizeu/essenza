import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard-profissional',
  templateUrl: './dashboard-profissional.component.html',
  styleUrls: ['./dashboard-profissional.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule]
})
export class DashboardProfissionalComponent implements OnInit {
  currentUser: User | null = null;
  user: User | null = null;
  isLoading = false;

  // Estatísticas reais do banco
  stats = {
    produtos: 0,
    servicos: 0,
    clientes: 0,
    anamnese: 0
  };

  // Lista de clientes para exibir
  clientes: User[] = [];
  produtos: any[] = [];
  servicos: any[] = [];
  fichasAnamnese: any[] = [];
  profissionais: User[] = [];

  // Propriedades para o template
  totalProdutos = 0;
  totalServicos = 0;
  totalClientes = 0;
  totalFichas = 0;
  totalProfissionais = 0;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.user = this.currentUser;
    this.inicializarFormularioProfissional();
    this.loadStats();
  }

  private loadStats(): void {
    console.log('🔍 Iniciando loadStats...');
    this.isLoading = true;

    // Buscar dados reais do backend
    Promise.all([
      this.loadClientes(),
      this.loadProdutos(),
      this.loadServicos(),
      this.loadFichasAnamnese(),
      this.loadProfissionais()
    ]).finally(() => {
      console.log('✅ loadStats concluído');
      this.isLoading = false;
    });
  }

  private async loadClientes(): Promise<void> {
    try {
      this.apiService.getClientes().subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          this.stats.clientes = clientes.length;
          this.totalClientes = clientes.length;
          console.log('✅ Clientes carregados:', clientes);
        },
        error: (error) => {
          console.error('❌ Erro ao carregar clientes:', error);
          this.stats.clientes = 0;
          this.totalClientes = 0;
        }
      });
    } catch (error) {
      console.error('❌ Erro ao carregar clientes:', error);
    }
  }

  private async loadProdutos(): Promise<void> {
    try {
      this.apiService.getProdutos().subscribe({
        next: (produtos) => {
          this.produtos = produtos;
          this.stats.produtos = produtos.length;
          this.totalProdutos = produtos.length;
          console.log('✅ Produtos carregados:', produtos);
        },
        error: (error) => {
          console.error('❌ Erro ao carregar produtos:', error);
          this.stats.produtos = 0;
          this.totalProdutos = 0;
        }
      });
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
    }
  }

  private async loadServicos(): Promise<void> {
    try {
      this.apiService.getServicos().subscribe({
        next: (servicos) => {
          this.servicos = servicos;
          this.stats.servicos = servicos.length;
          this.totalServicos = servicos.length;
          console.log('✅ Serviços carregados:', servicos);
        },
        error: (error) => {
          console.error('❌ Erro ao carregar serviços:', error);
          this.stats.servicos = 0;
          this.totalServicos = 0;
        }
      });
    } catch (error) {
      console.error('❌ Erro ao carregar serviços:', error);
    }
  }

  private async loadFichasAnamnese(): Promise<void> {
    try {
      this.apiService.getFichasAnamnese().subscribe({
        next: (fichas) => {
          this.fichasAnamnese = fichas;
          this.stats.anamnese = fichas.length;
          this.totalFichas = fichas.length;
          console.log('✅ Fichas de anamnese carregadas:', fichas);
        },
        error: (error) => {
          console.error('❌ Erro ao carregar fichas de anamnese:', error);
          this.stats.anamnese = 0;
          this.totalFichas = 0;
        }
      });
    } catch (error) {
      console.error('❌ Erro ao carregar fichas de anamnese:', error);
    }
  }

  // Métodos de navegação
  navegarParaEstoque(): void {
    this.router.navigate(['/estoque']);
  }

  navegarParaRegister(): void {
    this.router.navigate(['/register']);
  }

  navegarParaProdutos(): void {
    this.router.navigate(['/produtos']);
  }

  navegarParaServicos(): void {
    this.router.navigate(['/servicos']);
  }

  navegarParaDashboard(): void {
    // Navegar para o dashboard principal ou recarregar dados
    this.recarregarDados();
  }

  // Métodos para gerenciar clientes
  verCliente(cliente: User): void {
    console.log('👁️ Visualizando cliente:', cliente);
    // TODO: Implementar modal ou página de visualização do cliente
    alert(`Visualizando cliente: ${cliente.name}`);
  }

  editarCliente(cliente: User): void {
    console.log('✏️ Editando cliente:', cliente);
    // TODO: Implementar modal ou página de edição do cliente
    alert(`Editando cliente: ${cliente.name}`);
  }

  // Método para recarregar dados
  recarregarDados(): void {
    this.loadStats();
  }

  // ===== GERENCIAMENTO DE PROFISSIONAIS =====

  // Propriedades para o modal de profissionais
  profissionalForm!: FormGroup;
  profissionalEmEdicao: User | null = null;
  salvandoProfissional = false;

  // Propriedades para pesquisa de cliente
  termoPesquisa: string = '';
  resultadosPesquisa: User[] = [];
  pesquisando = false;
  clienteSelecionado: User | null = null;

  private inicializarFormularioProfissional(): void {
    console.log('🔍 Iniciando inicializarFormularioProfissional...');
    this.profissionalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      cell: ['', [Validators.required, Validators.minLength(10)]],
      birthDate: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]],
      admin: [true, [Validators.required]],
      especialidade: ['', [Validators.required]],
      cnec: ['', [Validators.required, Validators.min(100000), Validators.max(999999)]]
    }, { validators: this.mustMatch('password', 'passwordConfirm') });
    console.log('✅ Formulário de profissional inicializado');
  }

  private async loadProfissionais(): Promise<void> {
    try {
      console.log('🔍 Iniciando carregamento de profissionais...');
      this.apiService.getProfissionais().subscribe({
        next: (profissionais) => {
          console.log('✅ Resposta da API de profissionais:', profissionais);
          this.profissionais = profissionais;
          this.totalProfissionais = profissionais.length;
          console.log('✅ Profissionais carregados com sucesso. Total:', this.totalProfissionais);
          console.log('✅ Array de profissionais:', this.profissionais);
        },
        error: (error) => {
          console.error('❌ Erro ao carregar profissionais:', error);
          console.error('❌ Status do erro:', error.status);
          console.error('❌ Mensagem do erro:', error.message);
          this.totalProfissionais = 0;
        }
      });
    } catch (error) {
      console.error('❌ Erro ao carregar profissionais:', error);
    }
  }

  // Validador para confirmar senha
  private mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) return;

      matchingControl.setErrors(
        control.value !== matchingControl.value ? { mustMatch: true } : null
      );
    };
  }

  // Abrir modal para novo profissional
  abrirModalProfissional(): void {
    this.profissionalEmEdicao = null;
    this.profissionalForm.reset();
    this.profissionalForm.patchValue({
      password: '',
      passwordConfirm: ''
    });
    this.profissionalForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.profissionalForm.get('passwordConfirm')?.setValidators([Validators.required]);
    this.profissionalForm.updateValueAndValidity();

    // Abrir modal usando Bootstrap
    const modal = document.getElementById('modalProfissional');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  // Abrir modal para editar profissional
  editarProfissional(profissional: User): void {
    this.profissionalEmEdicao = profissional;
    this.profissionalForm.patchValue({
      name: profissional.name,
      email: profissional.email,
      cpf: profissional.cpf,
      cell: profissional.cell,
      birthDate: profissional.birthDate,
      address: profissional.address,
      admin: profissional.admin || true,
      especialidade: profissional.especialidade || '',
      cnec: profissional.cnec || ''
    });

    // Remover validação de senha para edição
    this.profissionalForm.get('password')?.clearValidators();
    this.profissionalForm.get('passwordConfirm')?.clearValidators();
    this.profissionalForm.updateValueAndValidity();

    // Abrir modal
    const modal = document.getElementById('modalProfissional');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  // Salvar profissional (criar ou atualizar)
  salvarProfissional(): void {
    if (this.profissionalForm.invalid) {
      this.profissionalForm.markAllAsTouched();
      return;
    }

    this.salvandoProfissional = true;
    const profissionalData = this.profissionalForm.value;

    if (this.profissionalEmEdicao) {
      // Atualizar profissional existente
      this.apiService.updateProfissional(this.profissionalEmEdicao.id!, profissionalData).subscribe({
        next: (response) => {
          console.log('✅ Profissional atualizado:', response);
          this.salvandoProfissional = false;
          this.fecharModalProfissional();
          this.loadProfissionais(); // Recarregar lista
          alert('Profissional atualizado com sucesso!');
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar profissional:', error);
          this.salvandoProfissional = false;
          alert('Erro ao atualizar profissional. Tente novamente.');
        }
      });
    } else {
             // Criar novo profissional
       const novoProfissional = {
         ...profissionalData,
         type: 'profissional',
         admin: profissionalData.admin || true,
         especialidade: profissionalData.especialidade,
         cnec: profissionalData.cnec
       };

      this.apiService.createProfissional(novoProfissional).subscribe({
        next: (response) => {
          console.log('✅ Profissional criado:', response);
          this.salvandoProfissional = false;
          this.fecharModalProfissional();
          this.loadProfissionais(); // Recarregar lista
          alert('Profissional cadastrado com sucesso!');
        },
        error: (error) => {
          console.error('❌ Erro ao criar profissional:', error);
          this.salvandoProfissional = false;
          alert('Erro ao cadastrar profissional. Tente novamente.');
        }
      });
    }
  }

  // Fechar modal
  fecharModalProfissional(): void {
    const modal = document.getElementById('modalProfissional');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.hide();
    }
  }

  // Visualizar profissional
  verProfissional(profissional: User): void {
    console.log('👁️ Visualizando profissional:', profissional);
    alert(`Visualizando profissional: ${profissional.name}\nEmail: ${profissional.email}\nCPF: ${profissional.cpf}`);
  }

  // Excluir profissional
  excluirProfissional(profissional: User): void {
    if (confirm(`Tem certeza que deseja excluir o profissional ${profissional.name}?`)) {
      this.apiService.deleteProfissional(profissional.id!).subscribe({
        next: () => {
          console.log('✅ Profissional excluído:', profissional.name);
          this.loadProfissionais(); // Recarregar lista
          alert('Profissional excluído com sucesso!');
        },
        error: (error) => {
          console.error('❌ Erro ao excluir profissional:', error);
          alert('Erro ao excluir profissional. Tente novamente.');
        }
      });
    }
  }

  // ===== PESQUISA DE CLIENTE =====

  // Abrir modal de pesquisa de cliente
  abrirModalPesquisaCliente(): void {
    this.termoPesquisa = '';
    this.resultadosPesquisa = [];
    this.clienteSelecionado = null;

    const modal = document.getElementById('modalPesquisaCliente');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  // Pesquisar cliente por nome
  pesquisarCliente(): void {
    if (!this.termoPesquisa.trim()) return;

    this.pesquisando = true;
    this.resultadosPesquisa = [];

    // Buscar todos os clientes e filtrar por nome
    this.apiService.getClientes().subscribe({
      next: (clientes) => {
        this.pesquisando = false;

        // Filtrar clientes que contenham o termo de pesquisa no nome
        this.resultadosPesquisa = clientes.filter(cliente =>
          cliente.name.toLowerCase().includes(this.termoPesquisa.toLowerCase())
        );

        console.log('✅ Pesquisa concluída. Resultados:', this.resultadosPesquisa);
      },
      error: (error) => {
        this.pesquisando = false;
        console.error('❌ Erro ao pesquisar clientes:', error);
        alert('Erro ao pesquisar clientes. Tente novamente.');
      }
    });
  }

  // Visualizar cliente completo com ficha de anamnese
  visualizarClienteCompleto(cliente: User): void {
    this.clienteSelecionado = cliente;

    // Fechar modal de pesquisa
    const modalPesquisa = document.getElementById('modalPesquisaCliente');
    if (modalPesquisa) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modalPesquisa);
      bootstrapModal.hide();
    }

    // Buscar ficha de anamnese do cliente
    this.apiService.getFichasAnamnese().subscribe({
      next: (fichas) => {
        const fichaCliente = fichas.find(f => f.cliente?.id === cliente.id);

        if (fichaCliente) {
          // Mostrar informações completas do cliente e ficha
          this.mostrarInformacoesCompletas(cliente, fichaCliente);
        } else {
          // Cliente sem ficha de anamnese
          this.mostrarInformacoesCompletas(cliente, null);
        }
      },
      error: (error) => {
        console.error('❌ Erro ao buscar ficha de anamnese:', error);
        // Mostrar apenas informações do cliente
        this.mostrarInformacoesCompletas(cliente, null);
      }
    });
  }

  // Mostrar informações completas do cliente
  private mostrarInformacoesCompletas(cliente: User, fichaAnamnese: any): void {
    let mensagem = `=== INFORMAÇÕES DO CLIENTE ===\n`;
    mensagem += `Nome: ${cliente.name}\n`;
    mensagem += `Email: ${cliente.email}\n`;
    mensagem += `CPF: ${cliente.cpf || 'N/A'}\n`;
    mensagem += `Telefone: ${cliente.cell || 'N/A'}\n`;
    mensagem += `Endereço: ${cliente.address || 'N/A'}\n`;
    mensagem += `Data de Nascimento: ${cliente.birthDate || 'N/A'}\n\n`;

    if (fichaAnamnese) {
      mensagem += `=== FICHA DE ANAMNESE ===\n`;
      mensagem += `ID da Ficha: ${fichaAnamnese.id}\n`;
      mensagem += `Data de Criação: ${fichaAnamnese.createdAt || 'N/A'}\n`;
      mensagem += `Última Atualização: ${fichaAnamnese.updatedAt || 'N/A'}\n`;

      // Adicionar campos específicos da ficha se existirem
      if (fichaAnamnese.queixaPrincipal) {
        mensagem += `Queixa Principal: ${fichaAnamnese.queixaPrincipal}\n`;
      }
      if (fichaAnamnese.historicoMedico) {
        mensagem += `Histórico Médico: ${fichaAnamnese.historicoMedico}\n`;
      }
      if (fichaAnamnese.alergias) {
        mensagem += `Alergias: ${fichaAnamnese.alergias}\n`;
      }
      if (fichaAnamnese.medicamentos) {
        mensagem += `Medicamentos: ${fichaAnamnese.medicamentos}\n`;
      }
    } else {
      mensagem += `❌ Este cliente ainda não possui ficha de anamnese cadastrada.\n`;
      mensagem += `Para cadastrar uma ficha, o cliente deve se registrar através do formulário de cadastro.`;
    }

    alert(mensagem);
  }
}
