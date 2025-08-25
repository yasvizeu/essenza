import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroStateService } from '../../services/registro-state.service';
import { EssenzaService } from '../../services/essenza.service';

@Component({
  selector: 'app-professional-login',
  standalone: false,
  templateUrl: './professional-login.html',
  styleUrls: ['./professional-login.scss']
})
export class ProfessionalLoginComponent implements OnInit {

  loginForm!: FormGroup;
  readonly type = 'profissional';
  showPassword = false;

  constructor(private fb: FormBuilder, private router: Router, private registro: RegistroStateService, private essenza: EssenzaService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const dados = {
      ...this.loginForm.value,
      type: this.type
    };

    this.essenza.authenticateProfissional({ email: dados.email, senha: dados.senha }).subscribe({
      next: (user: any) => {
        this.registro.setDadosRegistro(user);
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Credenciais inválidas para profissional.');
      }
    });
  }
}


