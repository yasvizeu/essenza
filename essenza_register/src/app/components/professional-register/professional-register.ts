import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EssenzaService } from '../../services/essenza.service';
import { RegistroStateService } from '../../services/registro-state.service';

@Component({
  selector: 'app-professional-register',
  standalone: false,
  templateUrl: './professional-register.html',
  styleUrls: ['./professional-register.scss']
})
export class ProfessionalRegisterComponent implements OnInit {

  professionalForm!: FormGroup;
  showPwd = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private essenzaService: EssenzaService,
    private registroService: RegistroStateService,
  ) {}

  ngOnInit(): void {
    this.professionalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]],
    });
  }

  controle(campo: string) {
    return this.professionalForm.get(campo);
  }

  toggleShow(): void {
    this.showPwd = !this.showPwd;
  }

  onSubmit(): void {
    if (this.professionalForm.invalid) {
      this.professionalForm.markAllAsTouched();
      return;
    }

    const professionalData = {
      ...this.professionalForm.value,
      type: 'profissional'
    };

    this.essenzaService.createProfessional(professionalData).subscribe({
      next: (response: any) => {
        this.registroService.setDadosRegistro(response);
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Erro ao cadastrar profissional. Verifique os dados e tente novamente.');
      }
    });
  }
}


