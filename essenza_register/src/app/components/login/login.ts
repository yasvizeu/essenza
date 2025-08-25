import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EssenzaService } from '../../services/essenza.service';
import { AuthService } from '../../services/auth.service';
import { TokenRefreshService } from '../../services/token-refresh.service';
import { RegistroStateService } from '../../services/registro-state.service';

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

  constructor(private fb: FormBuilder, private router: Router, private essenza: EssenzaService, private registro: RegistroStateService, private auth: AuthService, private tokenRefresh: TokenRefreshService) {}

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

  // Alternar visualização de senha
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Ação ao enviar formulário
onSubmit(): void {
  if (this.formAtual.invalid) return;

  const credentials = this.formAtual.value;

  this.essenza.authenticateCliente(credentials).subscribe({
    next: (res: any) => {
      // Espera: { user: { ... }, token: 'jwt...' }
      const token = res?.token;
      const user = res?.user ?? res;
      if (token) { this.auth.setToken(token); this.tokenRefresh.start(); }
      this.registro.setDadosRegistro(user);
      this.router.navigate(['/home']);
    },
    error: () => {
      alert('Credenciais inválidas. Verifique seu e-mail e senha.');
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
