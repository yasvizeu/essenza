import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroStateService } from '../../services/registro-state.service';
import { EssenzaService } from '../../services/essenza.service';
import { cpfValidator } from '../../validators/cpf.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./register.scss'],
  templateUrl: './register.html',
})
export class RegisterComponent implements OnInit {
  clientForm!: FormGroup;

  showPwd = false;
  showPwdConfirm = false;
  strengthClass = '';
  strengthPercent = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registroService: RegistroStateService,
    private essenzaService: EssenzaService,
  ) { }



  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(60), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      birthDate: ['', [Validators.required, this.validBirthDate()]],
      cpf: ['', [
        Validators.required,
        cpfValidator(),
      ]],
      email: ['', [Validators.required, Validators.email]],
      cell: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      address: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        // At least one uppercase, one lowercase, one number, one special character
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?!.*\s).{6,30}$/)
      ]],
      passwordConfirm: ['', [
        Validators.required,
      ]],
    }, { validators: this.mustMatch('password', 'passwordConfirm') });
  }

  validBirthDate() {
    return (control: any) => {
      if (!control.value) return null;

      const birthDate = new Date(control.value);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (birthDate > today) {
        return { invalidDate: true };
      }

      if (age < 1 || age > 120) {
        return { invalidAge: true };
      }

      return null;
    };
  }

  //força da senha

  toggleShow(): void {
    this.showPwd = !this.showPwd;
  }

  controle(campo: string) {
    return this.clientForm.get(campo);
  }

  updateStrength(): void {
    const pwd = this.controle('password')?.value || '';
    const { score, percent } = this.calcStrength(pwd);
    this.strengthPercent = percent;

    this.strengthClass =
      score <= 1 ? 'weak' :
        score === 2 ? 'fair' :
          score === 3 ? 'good' : 'strong';
  }

  private calcStrength(pwd: string): { score: number; percent: number } {
    let score = 0;

    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*()_+{}\[\]:;"'<>?,./]/.test(pwd)) score++;

    return { score, percent: (score / 5) * 100 };
  }
  // vê se coincide
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) return;

      matchingControl.setErrors(
        control.value !== matchingControl.value ? { mustMatch: true } : null
      );
    };
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      console.error('Formulário inválido. Por favor, preencha todos os campos corretamente');
      return;
    }

    const userData = {
      ...this.clientForm.value,
      type: 'cliente'
    };

    // Chamada ao serviço para enviar os dados ao back-end
    this.essenzaService.createClient(userData).subscribe({
      next: (response: any) => {
        console.log('Cliente registrado com sucesso!', response);
        // Salva a resposta completa (incluindo o ID) no serviço de estado
        this.registroService.setDadosRegistro(response);
        // Navega para a próxima etapa (Anamnese)
        this.router.navigate(['/anamnese']);
      },
      error: (error:any) => {
        console.error('Erro no registro:', error);
        // Lógica para lidar com erros, como CPF já cadastrado
        alert('Ocorreu um erro no cadastro. Por favor, verifique os dados e tente novamente.');
      }
    });
    }
  }

  // O método nextStep() não é mais necessário se a navegação for feita no subscribe.
  // Você pode chamá-lo diretamente do HTML, mas a lógica agora está em onSubmit.

     // A lógica de navegação foi movida para o onSubmit()


  // onSubmit() {
  //   if (this.clientForm.invalid) {
  //     this.clientForm.markAllAsTouched();
  //     console.error('Formulário inválido. Por favor, preencha todos os campos corretamente');
  //     return false; // Sai cedo se inválido
  //   }

  //   const userData = {
  //     ...this.clientForm.value,
  //     type: 'cliente'
  //   };

  //   this.registroService.setDadosRegistro(userData);


  //   console.log(userData);
  //   return true;  // sucesso
  // }


  // }
