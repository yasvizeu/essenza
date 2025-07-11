import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}

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

  const dadosCliente = this.formAtual.value;

  console.log('🟢 Cliente logado com sucesso:');
  console.table(dadosCliente); // Mostra os dados em forma de tabela
}


  // Autofoco no campo de e-mail ao iniciar a tela
  ngAfterViewInit(): void {
    const input = document.getElementById('email') as HTMLElement;
    if (input) {
      input.focus();
    }

  }

}
