import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EssenzaService } from '../../services/essenza.service';
import { RegistroStateService } from '../../services/registro-state.service';

@Component({
  selector: 'app-anamnese',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './anamnese.html',
  styleUrl: './anamnese.scss'
})
export class AnamneseComponent implements OnInit {

  anamneseForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private essenzaService: EssenzaService,
    private registroService: RegistroStateService,
  ) {}

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
      console.error('Formulário de anamnese inválido.');
      return;
    }

    const clienteBase = this.registroService.getDadosRegistro();

    if (!clienteBase || !clienteBase.id) {
      console.error('Dados de registro não encontrados ou sem ID do cliente.');
      alert('Seu registro expirou. Por favor, preencha o formulário novamente.');
      this.router.navigate(['/register']);
      return;
    }

    const dadosAnamnese = this.anamneseForm.value;

    // Combina os dados da ficha com o ID do cliente
    const dadosCompletos = {
      ...dadosAnamnese,
      clienteId: clienteBase.id, // Adicione o ID do cliente aqui!
    };

    console.log('JSON FINAL enviado para o NestJS:', dadosCompletos);

    this.essenzaService.createAnamnese(dadosCompletos).subscribe({
      next: (response: any) => {
        alert(response.message || 'Ficha de anamnese criada com sucesso!');
        this.anamneseForm.reset();
        this.registroService.clearDadosRegistro();
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Erro ao criar a ficha de anamnese:', error);
        alert('Ocorreu um erro ao criar a ficha. Por favor, tente novamente.');
      }
    });
  }
}
  // onSubmit(): void {
  //   if (this.anamneseForm.invalid) {
  //     this.anamneseForm.markAllAsTouched();
  //     console.error('Formulário de anamnese inválido.');
  //     return;
  //   }

  //   // Pega os dados de registro do serviço de estado.
  //   const clienteBase = this.registroService.getDadosRegistro();

  //   // Adicionado log para ver o que é retornado do serviço de estado.
  //   console.log('Dados do RegistroStateService:', clienteBase);

  //   if (!clienteBase) {
  //     console.error('Dados de registro não encontrados. Redirecionando para o registro.');
  //     // Adicionamos um alert para feedback mais claro ao usuário.
  //     alert('Seu registro expirou. Por favor, preencha o formulário novamente.');
  //     this.router.navigate(['/register']);
  //     return;
  //   }

  //   const dadosAnamnese = this.anamneseForm.value;

  //   // Combina os dados de registro com os dados da anamnese
  //   const dadosCompletos = {
  //     ...clienteBase,
  //     ...dadosAnamnese,
  //     // Garante que o tipo de persona seja sempre 'cliente'
  //   };

  //   console.log('JSON FINAL enviado para o NestJS:', dadosCompletos);

  //   this.essenzaService.create(dadosCompletos).subscribe({
  //     next: (response: any) => {
  //       alert(response.message || 'Cliente criado com sucesso!');
  //       this.anamneseForm.reset();
  //       // Limpa os dados de registro após o sucesso para evitar problemas.
  //       this.registroService.clearDadosRegistro();
  //       this.router.navigate(['/home']);
  //     },
  //     error: (error: any) => {
  //       console.error('Erro ao criar cliente:', error);
  //       alert('Ocorreu um erro ao criar o cliente. Por favor, tente novamente.');
  //     }
  //   });
  // }

// const userData = { /* seus dados */ };

// this.http.post('/persona', userData, {
//   headers: { 'Content-Type': 'application/json' }
// }).subscribe(response => {
//   console.log('Resposta', response);
// });

