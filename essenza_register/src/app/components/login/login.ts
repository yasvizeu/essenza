import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EssenzaService } from '../../services/essenza.service';

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
    private essenzaService: EssenzaService
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
    const dados = this.formAtual.value;

    if (this.isProfissional) {
      // Login de profissional
      this.essenzaService.loginProfissional(dados).subscribe({
        next: (response: any) => {
          console.log('🟢 Profissional logado com sucesso:', response);
          // Redirecionar para dashboard do profissional
          this.router.navigate(['/profissional/dashboard']);
        },
        error: (error: any) => {
          console.error('❌ Erro no login do profissional:', error);
          alert('Erro no login. Verifique suas credenciais.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      // Login de cliente
      this.essenzaService.loginCliente(dados).subscribe({
        next: (response: any) => {
          console.log('🟢 Cliente logado com sucesso:', response);
          // Redirecionar para dashboard do cliente
          this.router.navigate(['/cliente/dashboard']);
        },
        error: (error: any) => {
          console.error('❌ Erro no login do cliente:', error);
          alert('Erro no login. Verifique suas credenciais.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  // Autofoco no campo de e-mail ao iniciar a tela
  ngAfterViewInit(): void {
    const input = document.getElementById('email') as HTMLElement;
    if (input) {
      input.focus();
    }
  }
}
