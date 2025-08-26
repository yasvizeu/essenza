import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EssenzaService } from '../../services/essenza.service';
import { cpfValidator } from '../../validators/cpf.validator';

@Component({
  selector: 'app-professional-register',
  standalone: false,
  styleUrls: ['./professional-register.scss'],
  templateUrl: './professional-register.html',
})
export class ProfessionalRegister implements OnInit {
  professionalForm!: FormGroup;
  showPwd = false;
  showPwdConfirm = false;
  strengthClass = '';
  strengthPercent = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private essenzaService: EssenzaService,
  ) { }

  ngOnInit(): void {
    this.professionalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(60), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      birthDate: ['', [Validators.required, this.validBirthDate()]],
      cpf: ['', [
        Validators.required,
        cpfValidator(),
      ]],
      email: ['', [Validators.required, Validators.email]],
      cell: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      address: ['', [Validators.required]],
      especialidade: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      cnec: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      admin: [false],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
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

      if (age < 18 || age > 120) {
        return { invalidAge: true };
      }

      return null;
    };
  }

  toggleShow(): void {
    this.showPwd = !this.showPwd;
  }

  controle(campo: string) {
    return this.professionalForm.get(campo);
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
    if (this.professionalForm.invalid) {
      this.professionalForm.markAllAsTouched();
      console.error('Formulário inválido. Por favor, preencha todos os campos corretamente');
      return;
    }

    const professionalData = {
      ...this.professionalForm.value,
      type: 'profissional'
    };
    
    // Chamada ao serviço para enviar os dados ao back-end
    this.essenzaService.createProfessional(professionalData).subscribe({
      next: (response: any) => {
        console.log('Profissional registrado com sucesso!', response);
        alert('Profissional cadastrado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Erro no registro:', error);
        alert('Ocorreu um erro no cadastro. Por favor, verifique os dados e tente novamente.');
      }
    });
  }
}
