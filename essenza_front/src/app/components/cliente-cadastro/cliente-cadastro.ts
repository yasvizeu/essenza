import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService, Cliente, FichaAnamnese, ClienteCompleto } from '../../services/cliente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-cadastro',
  templateUrl: './cliente-cadastro.html',
  styleUrl: './cliente-cadastro.scss',
  imports: [ReactiveFormsModule],
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
    console.log('Componente inicializado');
    console.log('showError inicial:', this.showError);
    console.log('showSuccess inicial:', this.showSuccess);
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
    
    // Validação básica de CPF (algoritmo)
    if (!this.validarCPF(cleanCpf)) return { cpfInvalid: true };

    return null;
  }

  // Função para validar CPF (algoritmo)
  validarCPF(cpf: string): boolean {
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Calcular primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    
    if (parseInt(cpf.charAt(9)) !== digito1) return false;
    
    // Calcular segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    
    return parseInt(cpf.charAt(10)) === digito2;
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
          console.log('🚫 CPF já existe no sistema');
          this.cadastroForm.get('cpf')?.setErrors({ 'cpfAlreadyExists': true });
          // Mostrar mensagem de erro imediatamente
          this.showErrorMessage('❌ Este CPF já possui cadastro no sistema. Por favor, verifique se você já possui uma conta ou entre em contato conosco.');
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
          // Limpar mensagem de erro se CPF não existe
          if (this.showError && this.errorMessage.includes('CPF')) {
            this.showError = false;
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

  // Controle de mensagens de erro e sucesso
  errorMessage = '';
  successMessage = '';
  showError = false;
  showSuccess = false;

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
    // Marcar todos os campos como tocados para mostrar erros
    this.markAllFieldsAsTouched();
    
    // Verificar se há erro de CPF já existente
    if (this.cadastroForm.get('cpf')?.errors?.['cpfAlreadyExists']) {
      console.log('🚫 CPF já existe - impedindo envio');
      this.showErrorMessage('❌ Este CPF já possui cadastro no sistema. Por favor, verifique se você já possui uma conta ou entre em contato conosco.');
      return;
    }
    
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
          // Exibir mensagem de sucesso
          this.showSuccessMessage('✅ Cadastro realizado com sucesso! Redirecionando...');
          // Redirecionar para página de login após um pequeno delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erro ao cadastrar cliente:', error);
          this.isLoading = false;
          this.handleRegistrationError(error);
        }
      });
    } else {
      // Se o formulário não é válido, mostrar mensagem de erro
      this.showErrorMessage('❌ Por favor, corrija os erros nos campos destacados em vermelho antes de continuar.');
    }
  }

  // Marcar todos os campos como tocados para mostrar erros
  markAllFieldsAsTouched(): void {
    Object.keys(this.cadastroForm.controls).forEach(key => {
      this.cadastroForm.get(key)?.markAsTouched();
    });
    
    Object.keys(this.anamneseForm.controls).forEach(key => {
      this.anamneseForm.get(key)?.markAsTouched();
    });
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
        return 'Este CPF já possui cadastro';
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
        return 'Senhas diferentes';
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

  // Tratar erros de cadastro
  handleRegistrationError(error: any): void {
    console.error('Erro detalhado:', error);
    console.error('Status do erro:', error.status);
    console.error('Mensagem do erro:', error.error);
    
    // Limpar mensagens anteriores
    this.showError = false;
    this.showSuccess = false;
    
    // Voltar automaticamente para o passo 1 (dados pessoais) quando há erro
    //this.currentStep = 1;
   // console.log('🔄 Voltando automaticamente para o passo 1 (Dados Pessoais)');
    
    // Marcar todos os campos como tocados para mostrar erros visuais
    this.markAllFieldsAsTouched();
    
    // Verificar se há mensagem específica do backend
    if (error.error && error.error.message) {
      console.log('Exibindo mensagem específica do backend:', error.error.message);
      
      // Personalizar mensagens específicas
      if (error.error.message.includes('CPF')) {
        this.showErrorMessage('❌ Este CPF já possui cadastro no sistema. Por favor, verifique se você já possui uma conta ou entre em contato conosco.');
      } else if (error.error.message.includes('email')) {
        this.showErrorMessage('❌ Este email já possui cadastro no sistema. Tente fazer login ou use outro email.');
      } else {
        this.showErrorMessage(`❌ ${error.error.message}`);
      }
      return;
    }
    
    // Verificar status HTTP específicos
    if (error.status === 409) {
      console.log('Erro 409 - Conflito detectado');
      this.showErrorMessage('❌ Este CPF ou email já possui cadastro no sistema. Verifique seus dados ou tente fazer login.');
    } else if (error.status === 400) {
      console.log('Erro 400 - Dados inválidos');
      this.showErrorMessage('❌ Dados inválidos. Verifique se todos os campos estão preenchidos corretamente e tente novamente.');
    } else if (error.status === 0) {
      console.log('Erro 0 - Problema de conexão');
      this.showErrorMessage('❌ Erro de conexão. Verifique sua internet e tente novamente.');
    } else if (error.status === 500) {
      console.log('Erro 500 - Erro interno do servidor');
      this.showErrorMessage('❌ Erro interno do servidor. Tente novamente em alguns minutos.');
    } else {
      console.log('Erro genérico - Status:', error.status);
      this.showErrorMessage('❌ Erro interno do servidor. Tente novamente mais tarde.');
    }
  }

  // Exibir mensagem de erro
  showErrorMessage(message: string): void {
    console.log('Exibindo mensagem de erro:', message);
    this.errorMessage = message;
    this.showError = true;
    this.showSuccess = false;
    
    // Scroll para o topo para garantir que o usuário veja a mensagem
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    
    // Forçar detecção de mudanças e log de debug
    setTimeout(() => {
      console.log('✅ Estado showError:', this.showError);
      console.log('✅ Mensagem de erro:', this.errorMessage);
      console.log('✅ Passo atual:', this.currentStep);
    }, 200);
    
    // Auto-hide após 15 segundos (tempo suficiente para o usuário ler)
    setTimeout(() => {
      this.showError = false;
    }, 15000);
  }

  // Exibir mensagem de sucesso
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    this.showError = false;
    
    // Auto-hide após 3 segundos
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  // Fechar mensagem de erro
  closeError(): void {
    this.showError = false;
  }

  // Fechar mensagem de sucesso
  closeSuccess(): void {
    this.showSuccess = false;
  }

  // Método de teste para simular erro (remover em produção)
  testErrorHandling(): void {
    console.log('🧪 Testando tratamento de erro...');
    const mockError = {
      status: 409,
      error: {
        message: 'Este CPF já possui cadastro no sistema'
      }
    };
    this.handleRegistrationError(mockError);
  }

  // Método de teste para simular CPF já existente (remover em produção)
  testCpfExists(): void {
    console.log('🧪 Testando CPF já existente...');
    // Simular um CPF já existente
    this.cadastroForm.get('cpf')?.setValue('123.456.789-00');
    this.cadastroForm.get('cpf')?.setErrors({ 'cpfAlreadyExists': true });
    this.showErrorMessage('❌ Este CPF já possui cadastro no sistema. Por favor, verifique se você já possui uma conta ou entre em contato conosco.');
  }
}
