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
      name: ['', [Validators.required, Validators.minLength(3), this.nameValidator]], // Mudado de 'nome' para 'name'
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]], // Mudado de 'senha' para 'password'
      confirmPassword: ['', [Validators.required]],
      cpf: ['', [Validators.required, this.cpfValidator]],
      birthDate: ['', [Validators.required, this.birthDateValidator]],
      cell: ['', [Validators.required, this.cellValidator]],
      address: ['', [Validators.required, Validators.minLength(10), this.addressValidator]]
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

  // Validador de força da senha
  passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    const errors: any = {};
    if (!hasMinLength) errors.passwordMinLength = true;
    if (!hasUpperCase) errors.passwordNoUpperCase = true;
    if (!hasLowerCase) errors.passwordNoLowerCase = true;
    if (!hasNumbers) errors.passwordNoNumbers = true;
    if (!hasSpecialChar) errors.passwordNoSpecialChar = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador de nome
  nameValidator(control: AbstractControl): { [key: string]: any } | null {
    const name = control.value;
    if (!name) return null;

    const errors: any = {};
    if (name.length < 3) errors.nameTooShort = true;
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) errors.nameInvalidChars = true;
    if (name.trim().split(' ').length < 2) errors.nameNeedSurname = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador de CPF
  cpfValidator(control: AbstractControl): { [key: string]: any } | null {
    const cpf = control.value;
    if (!cpf) return null;

    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return { cpfInvalidLength: true };
    if (!this.clienteService.validarCPF(cpf)) return { cpfInvalid: true };

    return null;
  }

  // Validador de data de nascimento
  birthDateValidator(control: AbstractControl): { [key: string]: any } | null {
    const birthDate = control.value;
    if (!birthDate) return null;

    const date = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    const errors: any = {};
    if (isNaN(date.getTime())) errors.birthDateInvalid = true;
    if (age < 18 || (age === 18 && monthDiff < 0)) errors.birthDateTooYoung = true;
    if (age > 120) errors.birthDateTooOld = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador de celular
  cellValidator(control: AbstractControl): { [key: string]: any } | null {
    const cell = control.value;
    if (!cell) return null;

    const cleanCell = cell.replace(/\D/g, '');
    const errors: any = {};
    
    if (cleanCell.length !== 11) errors.cellInvalidLength = true;
    if (!/^[1-9]{2}[2-9][0-9]{8}$/.test(cleanCell)) errors.cellInvalidFormat = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador de endereço
  addressValidator(control: AbstractControl): { [key: string]: any } | null {
    const address = control.value;
    if (!address) return null;

    const errors: any = {};
    if (address.length < 10) errors.addressTooShort = true;
    if (!/^[a-zA-ZÀ-ÿ0-9\s,.-]+$/.test(address)) errors.addressInvalidChars = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validação em tempo real para todos os campos
  onFieldChange(fieldName: string): void {
    const control = this.cadastroForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  // Validação de CPF em tempo real
  onCpfChange(event: any): void {
    this.formatarCPF(event);
    this.onFieldChange('cpf');
    
    // Verificar se CPF já existe no banco
    const cpf = event.target.value;
    if (cpf && cpf.replace(/\D/g, '').length === 11) {
      this.verificarCpfExistente(cpf);
    }
  }

  // Verificar se CPF já existe no banco
  verificarCpfExistente(cpf: string): void {
    this.isCheckingCpf = true;
    this.clienteService.verificarCpfExistente(cpf).subscribe({
      next: (response) => {
        this.isCheckingCpf = false;
        if (response.exists) {
          this.cadastroForm.get('cpf')?.setErrors({ 'cpfAlreadyExists': true });
        } else {
          // Remove o erro de CPF existente se houver
          const control = this.cadastroForm.get('cpf');
          if (control?.errors?.['cpfAlreadyExists']) {
            delete control.errors['cpfAlreadyExists'];
            if (Object.keys(control.errors).length === 0) {
              control.setErrors(null);
            } else {
              control.setErrors(control.errors);
            }
          }
        }
      },
      error: (error) => {
        this.isCheckingCpf = false;
        console.error('Erro ao verificar CPF:', error);
      }
    });
  }

  // Validação de email em tempo real
  onEmailChange(event: any): void {
    this.onFieldChange('email');
  }

  // Validação de celular em tempo real
  onCellChange(event: any): void {
    this.formatarCelular(event);
    this.onFieldChange('cell');
  }

  // Validação de nome em tempo real
  onNameChange(event: any): void {
    this.onFieldChange('name');
  }

  // Validação de senha em tempo real
  onPasswordChange(event: any): void {
    this.onFieldChange('password');
    this.onFieldChange('confirmPassword');
  }

  // Validação de data em tempo real
  onBirthDateChange(event: any): void {
    this.onFieldChange('birthDate');
  }

  // Validação de endereço em tempo real
  onAddressChange(event: any): void {
    this.onFieldChange('address');
  }

  // Obter status da senha para feedback visual
  getPasswordStatus(): { valid: boolean, requirements: any } {
    const password = this.cadastroForm.get('password')?.value || '';
    
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const valid = Object.values(requirements).every(req => req === true);
    
    return { valid, requirements };
  }

  // Verificar se um campo é válido
  isFieldValid(fieldName: string): boolean {
    const control = this.cadastroForm.get(fieldName);
    return control ? control.valid && control.touched : false;
  }

  // Verificar se um campo tem erro
  hasFieldError(fieldName: string): boolean {
    const control = this.cadastroForm.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  // Controle de visualização de senha
  showPassword = false;
  showConfirmPassword = false;

  // Controle de verificação de CPF
  isCheckingCpf = false;

  // Alternar visualização da senha
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Alternar visualização da confirmação de senha
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
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
        type: 'cliente', // Campo necessário para identificar a tabela
        cpf: this.cadastroForm.value.cpf,
        birthDate: this.cadastroForm.value.birthDate,
        cell: this.cadastroForm.value.cell,
        address: this.cadastroForm.value.address
      };

      console.log('🔍 Debug - Dados do cliente sendo enviados:', cliente);
      console.log('🔍 Debug - Form values:', this.cadastroForm.value);

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
          // Redirecionar para página de login
          this.router.navigate(['/login']);
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
      // Erros básicos
      if (control.errors['required']) {
        return 'Este campo é obrigatório';
      }
      
      // Erros de email
      if (control.errors['email']) {
        return 'Email inválido';
      }
      
      // Erros de nome
      if (control.errors['nameTooShort']) {
        return 'Nome deve ter pelo menos 3 caracteres';
      } else if (control.errors['nameInvalidChars']) {
        return 'Nome deve conter apenas letras e espaços';
      } else if (control.errors['nameNeedSurname']) {
        return 'Digite seu nome completo (nome e sobrenome)';
      }
      
      // Erros de CPF
      if (control.errors['cpfInvalidLength']) {
        return 'CPF deve ter 11 dígitos';
      } else if (control.errors['cpfInvalid']) {
        return 'CPF inválido';
      } else if (control.errors['cpfAlreadyExists']) {
        return 'Este CPF já está cadastrado no sistema';
      }
      
      // Erros de data de nascimento
      if (control.errors['birthDateInvalid']) {
        return 'Data de nascimento inválida';
      } else if (control.errors['birthDateTooYoung']) {
        return 'Você deve ter pelo menos 18 anos';
      } else if (control.errors['birthDateTooOld']) {
        return 'Data de nascimento inválida';
      }
      
      // Erros de celular
      if (control.errors['cellInvalidLength']) {
        return 'Celular deve ter 11 dígitos';
      } else if (control.errors['cellInvalidFormat']) {
        return 'Formato de celular inválido';
      }
      
      // Erros de endereço
      if (control.errors['addressTooShort']) {
        return 'Endereço deve ter pelo menos 10 caracteres';
      } else if (control.errors['addressInvalidChars']) {
        return 'Endereço contém caracteres inválidos';
      }
      
      // Erros de senha
      if (control.errors['passwordMinLength']) {
        return 'Senha deve ter pelo menos 8 caracteres';
      } else if (control.errors['passwordNoUpperCase']) {
        return 'Senha deve conter pelo menos 1 letra maiúscula';
      } else if (control.errors['passwordNoLowerCase']) {
        return 'Senha deve conter pelo menos 1 letra minúscula';
      } else if (control.errors['passwordNoNumbers']) {
        return 'Senha deve conter pelo menos 1 número';
      } else if (control.errors['passwordNoSpecialChar']) {
        return 'Senha deve conter pelo menos 1 caractere especial (!@#$%^&*...)';
      } else if (control.errors['passwordMismatch']) {
        return 'As senhas não coincidem';
      }
      
      // Erro de comprimento mínimo genérico
      if (control.errors['minlength']) {
        return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
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
