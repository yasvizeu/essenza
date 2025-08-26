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

  // Alternar visualização de senha
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Ação ao enviar formulário
  onSubmit(): void {
    if (this.formAtual.invalid) {
      this.formAtual.markAllAsTouched();
      return;
    }

    const loginData = this.formAtual.value;
    const userType = this.isProfissional ? 'profissional' : 'cliente';

    console.log(`🟢 Tentando login como ${userType}:`);
    console.table(loginData);

    // Chamada ao serviço para autenticação
    this.essenzaService.login(loginData).subscribe({
      next: (response: any) => {
        console.log('Login realizado com sucesso!', response);
        
        // Salvar dados do usuário no localStorage
        localStorage.setItem('userToken', 'token-' + Date.now()); // Token mock
        localStorage.setItem('userType', response.type || userType);
        localStorage.setItem('userData', JSON.stringify(response.user || response));
        
        // Redirecionar baseado no tipo de usuário
        if (response.type === 'profissional' || userType === 'profissional') {
          this.router.navigate(['/home']); // ou para uma página específica de profissional
        } else {
          this.router.navigate(['/home']); // ou para uma página específica de cliente
        }
      },
      error: (error: any) => {
        console.error('Erro no login:', error);
        alert('Erro no login. Verifique suas credenciais e tente novamente.');
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
