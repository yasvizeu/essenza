import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EssenzaService } from '../../services/essenza.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit, AfterViewInit {

  loginForm!: FormGroup;
  professionalForm!: FormGroup;
  isProfissional = false;
  showPassword = false;
  showProfessionalPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private essenzaService: EssenzaService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Formulário para usuário comum
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });

    // Formulário para profissional
    this.professionalForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  // Getter para decidir qual formulário está ativo
  get formAtual(): FormGroup {
    return this.isProfissional ? this.professionalForm : this.loginForm;
  }

  // Alternar entre cliente e profissional
  toggleTipoUsuario(): void {
    this.isProfissional = !this.isProfissional;
    // Limpar formulários ao alternar
    this.loginForm.reset();
    this.professionalForm.reset();
  }

  // Alternar visualização de senha para cliente
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Alternar visualização de senha para profissional
  toggleProfessionalPassword(): void {
    this.showProfessionalPassword = !this.showProfessionalPassword;
  }

  // Ação ao enviar formulário
  onSubmit(): void {
    if (this.formAtual.invalid) return;

    this.isLoading = true;
    const dados: LoginRequest = this.formAtual.value;

    // Usar o AuthService para autenticação
    this.authService.login(dados).subscribe({
      next: (response) => {
        console.log('🟢 Login realizado com sucesso:', response);
        
        // Verificar se há uma URL de retorno
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        
        // Redirecionar baseado no tipo de usuário
        if (response.user.tipo === 'profissional') {
          this.router.navigate(['/dashboard-profissional']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('❌ Erro no login:', error);
        alert('Erro no login. Verifique suas credenciais.');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Autofoco no campo de e-mail ao iniciar a tela
  ngAfterViewInit(): void {
    const input = document.getElementById('email') as HTMLElement;
    if (input) {
      input.focus();
    }
  }
}
