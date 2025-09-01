import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService, Cliente, FichaAnamnese, ClienteCompleto } from '../../services/cliente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-cadastro',
  templateUrl: './cliente-cadastro.html',
  styleUrl: './cliente-cadastro.scss',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class ClienteCadastroComponent implements OnInit {
  cadastroForm!: FormGroup;
  anamneseForm!: FormGroup;
  isLoading = false;
  currentStep = 1;
  totalSteps = 2;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    // Formulário de dados pessoais
    this.cadastroForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Mudado de 'nome' para 'name'
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]], // Mudado de 'senha' para 'password'
      confirmPassword: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      cell: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(10)]]
    }, { validators: this.passwordMatchValidator });

    // Formulário de anamnese
    this.anamneseForm = this.fb.group({
      healthProblems: ['', [Validators.required, Validators.minLength(10)]],
      medications: ['', [Validators.required]],
      allergies: ['', [Validators.required]],
      surgeries: ['', [Validators.required]],
      lifestyle: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Validador personalizado para confirmar senha
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password'); // Mudado de 'senha' para 'password'
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  // Validação de CPF em tempo real
  onCpfChange(event: any): void {
    const cpf = event.target.value;
    if (cpf && !this.clienteService.validarCPF(cpf)) {
      this.cadastroForm.get('cpf')?.setErrors({ 'invalidCpf': true });
    } else {
      this.cadastroForm.get('cpf')?.setErrors(null);
    }
  }

  // Validação de email em tempo real
  onEmailChange(event: any): void {
    const email = event.target.value;
    if (email && !this.clienteService.validarEmail(email)) {
      this.cadastroForm.get('email')?.setErrors({ 'invalidEmail': true });
    } else {
      this.cadastroForm.get('email')?.setErrors(null);
    }
  }

  // Validação de celular em tempo real
  onCellChange(event: any): void {
    const cell = event.target.value;
    if (cell && !this.clienteService.validarCelular(cell)) {
      this.cadastroForm.get('cell')?.setErrors({ 'invalidCell': true });
    } else {
      this.cadastroForm.get('cell')?.setErrors(null);
    }
  }

  // Próximo passo
  nextStep(): void {
    if (this.currentStep === 1 && this.cadastroForm.valid) {
      this.currentStep = 2;
    }
  }

  // Passo anterior
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Submeter formulário completo
  onSubmit(): void {
    if (this.cadastroForm.valid && this.anamneseForm.valid) {
      this.isLoading = true;

      const cliente: Cliente = {
        email: this.cadastroForm.value.email,
        name: this.cadastroForm.value.name, // Mudado de 'nome' para 'name'
        password: this.cadastroForm.value.password, // Mudado de 'senha' para 'password'
        type: 'cliente', // Mudado de 'tipo' para 'type'
        cpf: this.cadastroForm.value.cpf,
        birthDate: this.cadastroForm.value.birthDate,
        cell: this.cadastroForm.value.cell,
        address: this.cadastroForm.value.address
      };

      const fichaAnamnese: FichaAnamnese = {
        healthProblems: this.anamneseForm.value.healthProblems,
        medications: this.anamneseForm.value.medications,
        allergies: this.anamneseForm.value.allergies,
        surgeries: this.anamneseForm.value.surgeries,
        lifestyle: this.anamneseForm.value.lifestyle
      };

      const clienteCompleto: ClienteCompleto = {
        cliente,
        fichaAnamnese
      };

      this.clienteService.cadastrarClienteCompleto(clienteCompleto).subscribe({
        next: (response) => {
          console.log('Cliente cadastrado com sucesso:', response);
          this.isLoading = false;
          // Redirecionar para página de sucesso ou login
          this.router.navigate(['/cadastro-sucesso']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar cliente:', error);
          this.isLoading = false;
          // Aqui você pode implementar tratamento de erro mais específico
        }
      });
    }
  }

  // Verificar se o passo atual é válido
  isStepValid(step: number): boolean {
    if (step === 1) {
      return this.cadastroForm.valid;
    } else if (step === 2) {
      return this.anamneseForm.valid;
    }
    return false;
  }

  // Obter mensagens de erro para campos específicos
  getErrorMessage(controlName: string, form: FormGroup): string {
    const control = form.get(controlName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return 'Este campo é obrigatório';
      } else if (control.errors['email']) {
        return 'Email inválido';
      } else if (control.errors['minlength']) {
        return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
      } else if (control.errors['invalidCpf']) {
        return 'CPF inválido';
      } else if (control.errors['invalidEmail']) {
        return 'Email inválido';
      } else if (control.errors['invalidCell']) {
        return 'Celular inválido';
      } else if (control.errors['passwordMismatch']) {
        return 'As senhas não coincidem';
      }
    }
    return '';
  }

  // Formatar CPF automaticamente
  formatarCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      event.target.value = value;
    }
  }

  // Formatar celular automaticamente
  formatarCelular(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      event.target.value = value;
    }
  }
}
