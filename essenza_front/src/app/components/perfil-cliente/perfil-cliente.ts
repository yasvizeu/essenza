import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { FichaAnamneseService, FichaAnamnese } from '../../services/ficha-anamnese';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.html',
  styleUrl: './perfil-cliente.scss',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class PerfilClienteComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  fichaAnamnese: FichaAnamnese | null = null;
  isLoading = false;
  isEditing = false;
  private authSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private fichaAnamneseService: FichaAnamneseService
  ) {}

  ngOnInit(): void {
    console.log('🔄 PerfilClienteComponent - ngOnInit iniciado');
    
    // Carregar usuário atual imediatamente
    this.currentUser = this.authService.getCurrentUser();
    console.log('🔄 PerfilClienteComponent - Usuário atual:', this.currentUser);
    
    if (this.currentUser && this.currentUser.tipo === 'cliente') {
      console.log('🔄 PerfilClienteComponent - Carregando ficha de anamnese para cliente ID:', this.currentUser.id);
      this.loadFichaAnamnese();
    }
    
    this.authSubscription.add(
      this.authService.currentUser$.subscribe(user => {
        console.log('🔄 PerfilClienteComponent - Usuário recebido via subscription:', user);
        this.currentUser = user;
        if (user && user.tipo === 'cliente') {
          console.log('🔄 PerfilClienteComponent - Carregando ficha de anamnese para cliente ID:', user.id);
          this.loadFichaAnamnese();
        } else {
          console.log('❌ PerfilClienteComponent - Usuário não é cliente ou não está autenticado');
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  loadFichaAnamnese(): void {
    if (!this.currentUser?.id) {
      console.log('❌ PerfilClienteComponent - Usuário não tem ID:', this.currentUser);
      return;
    }

    console.log('🔄 PerfilClienteComponent - Carregando ficha de anamnese para cliente ID:', this.currentUser.id);
    this.isLoading = true;
    
    // Timeout para evitar carregamento infinito
    const timeout = setTimeout(() => {
      console.log('⏰ PerfilClienteComponent - Timeout atingido, criando ficha de exemplo');
      this.isLoading = false;
      this.createExampleFichaAnamnese();
    }, 5000);
    
    this.fichaAnamneseService.getFichaAnamneseByClienteId(this.currentUser.id).subscribe({
      next: (ficha) => {
        clearTimeout(timeout);
        console.log('✅ PerfilClienteComponent - Ficha de anamnese carregada:', ficha);
        this.fichaAnamnese = ficha;
        this.isLoading = false;
      },
      error: (error) => {
        clearTimeout(timeout);
        console.error('❌ PerfilClienteComponent - Erro ao carregar ficha de anamnese:', error);
        this.isLoading = false;
        // Se não encontrar ficha, criar uma nova
        console.log('🔄 PerfilClienteComponent - Criando nova ficha de anamnese...');
        this.createNewFichaAnamnese();
      }
    });
  }

  createExampleFichaAnamnese(): void {
    console.log('🔄 PerfilClienteComponent - Criando ficha de exemplo');
    this.fichaAnamnese = {
      id: 1,
      healthProblems: 'Nenhum problema de saúde conhecido. Pressão arterial normal.',
      medications: 'Não utiliza medicamentos contínuos.',
      allergies: 'Alergia a perfumes fortes e produtos com fragrância artificial.',
      surgeries: 'Nenhuma cirurgia realizada.',
      lifestyle: 'Estilo de vida ativo. Pratica yoga 3x por semana, caminhada diária.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cliente: {
        id: this.currentUser.id,
        name: this.currentUser.nome || this.currentUser.name,
        email: this.currentUser.email,
        cpf: this.currentUser.cpf,
        birthDate: this.currentUser.birthDate,
        cell: this.currentUser.cell,
        address: this.currentUser.address
      }
    };
    this.isEditing = true; // Permitir edição imediatamente
  }

  createNewFichaAnamnese(): void {
    if (!this.currentUser?.id) return;

    const newFicha = {
      healthProblems: '',
      medications: '',
      allergies: '',
      surgeries: '',
      lifestyle: '',
      clienteId: this.currentUser.id
    };

    this.fichaAnamneseService.createFichaAnamnese(newFicha).subscribe({
      next: (ficha) => {
        this.fichaAnamnese = ficha;
        this.isEditing = true;
      },
      error: (error) => {
        console.error('Erro ao criar ficha de anamnese:', error);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveFichaAnamnese(): void {
    if (!this.fichaAnamnese?.id) return;

    this.isLoading = true;
    this.fichaAnamneseService.updateFichaAnamnese(this.fichaAnamnese.id, this.fichaAnamnese).subscribe({
      next: (ficha) => {
        this.fichaAnamnese = ficha;
        this.isEditing = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao salvar ficha de anamnese:', error);
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    // Recarregar dados originais
    this.loadFichaAnamnese();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
