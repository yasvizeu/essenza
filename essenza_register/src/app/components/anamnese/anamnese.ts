import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anamnese',
  standalone: false,
  templateUrl: './anamnese.html',
  styleUrl: './anamnese.scss'
})
export class Anamnese {

  anamneseForm!: FormGroup

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.anamneseForm = this.fb.group({
      healthProblems: ['', Validators.required],
      medications: [''],
      allergies: [''],
      surgeries: [''],
      lifestyle: ['', Validators.required],
    });
  }

  controle(campo: string) {
    return this.anamneseForm.get(campo);
  }

  onSubmit(): void {
    if (this.anamneseForm.invalid) {
      this.anamneseForm.markAllAsTouched();
      return;
    }

    const formData = this.anamneseForm.value;
    console.log('Ficha de anamnese:', formData);

    // Provisório: depois ir para a próxima etapa (ex: home)
    this.router.navigate(['/home']);
  }
}
