import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User, LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class Login implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isProfessionalLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Verificar se já está autenticado
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnUserType();
    }
  }

  toggleLoginType(): void {
    this.isProfessionalLogin = !this.isProfessionalLogin;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;

      // Escolher método de login baseado no tipo
      const loginObservable = this.isProfessionalLogin
        ? this.authService.loginProfissional(credentials)
        : this.authService.login(credentials);

      loginObservable.subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login realizado com sucesso:', response.user.name);

          // Redirecionar baseado no tipo de usuário
          this.redirectBasedOnUserType();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro no login:', error);

          if (error.status === 401) {
            this.errorMessage = 'Email ou senha incorretos.';
          } else if (error.status === 0) {
            this.errorMessage = 'Erro de conexão. Verifique sua internet.';
          } else {
            this.errorMessage = 'Erro ao fazer login. Tente novamente.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private redirectBasedOnUserType(): void {
    // Usar o método do AuthService para redirecionamento
    this.authService.redirectBasedOnUserType();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} é obrigatório.`;
    }

    if (field?.hasError('email')) {
      return 'Email inválido.';
    }

    if (field?.hasError('minlength')) {
      return `${this.getFieldDisplayName(fieldName)} deve ter pelo menos 6 caracteres.`;
    }

    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    switch (fieldName) {
      case 'email': return 'Email';
      case 'senha': return 'Senha';
      default: return fieldName;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}
