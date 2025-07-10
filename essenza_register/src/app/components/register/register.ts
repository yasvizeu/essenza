import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  styleUrls: ['./register.scss'],
  templateUrl: './register.html',
})
export class Register implements OnInit {
  clientForm!: FormGroup;

  constructor(private fb: FormBuilder) {}  // servize precisa entrar aqui depois

  showPwd = false;  
  showPwdConfirm = false;         // controla olho
  strengthClass = '';         // css da barra
  strengthPercent = 0;        // largura da barra (0–100)

  // alterna tipo do input senha
  toggleShow() {
    this.showPwd = !this.showPwd;
  }

  // calcula a força da senha em tempo real
  updateStrength() {
    const pwd = this.controle('password')?.value || '';
    const { score, percent } = this.calcStrength(pwd);
    this.strengthPercent = percent;

    // mapeia score → classe css
    this.strengthClass =
      score <= 1 ? 'weak' :
      score === 2 ? 'fair' :
      score === 3 ? 'good' : 'strong';
  }

  /** Algoritmo simples: soma pontos pelos requisitos cumpridos. */
  private calcStrength(pwd: string): { score: number; percent: number } {
    let score = 0;

    if (pwd.length >= 6)                       score++;        // comprimento
    if (/[A-Z]/.test(pwd))                     score++;        // maiúscula
    if (/[a-z]/.test(pwd))                     score++;        // minúscula
    if (/\d/.test(pwd))                        score++;        // número
    if (/[!@#$%^&*()_+{}\[\]:;"'<>?,./]/.test(pwd)) score++;   // símbolo

    // score máx = 5 → converte p/ 0‑100 %
    return { score, percent: (score / 5) * 100 };
  }


  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(60), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      age: [null, [Validators.required, Validators.min(1), Validators.max(150)]],
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
    Validators.minLength(6),
    Validators.maxLength(30)
  ]],
}, { validators: this.mustMatch('password', 'passwordConfirm') });
  }

  controle(campo: string) {
    return this.clientForm.get(campo);
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

  mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

}
