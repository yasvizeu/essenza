import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  styleUrls: ['./register.scss'],
  templateUrl: './register.html',
})
export class Register implements OnInit {
  clientForm!: FormGroup;

  showPwd = false;
  showPwdConfirm = false;
  strengthClass = '';
  strengthPercent = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group(
      {
        name: ['', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(60),
          Validators.pattern(/^[a-zA-Z\s]*$/)
        ]],
        age: [null, [
          Validators.required,
          Validators.min(1),
          Validators.max(150)
        ]],
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        cell: ['', [
          Validators.required,
          Validators.pattern(/^\d{10,11}$/)
        ]],
        address: ['', [Validators.required]],
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?!.*\s).{6,30}$/)
        ]],
        passwordConfirm: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)
        ]]
      },
      { validators: this.mustMatch('password', 'passwordConfirm') }
    );
  }

  // Getter para facilitar acesso aos controles
  controle(campo: string) {
    return this.clientForm.get(campo);
  }

  toggleShow(): void {
    this.showPwd = !this.showPwd;
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
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      console.error('Formulário inválido. Por favor, preencha todos os campos corretamente');
      return;
    }

    const userClient = this.clientForm.value;
    console.log(userClient);
  }

  nextStep(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.onSubmit()
      return;
    }

    // Aqui você pode salvar os dados em um service ou store, se quiser
    this.router.navigate(['/anamnese']);
  }
}
