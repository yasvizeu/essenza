import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegisterProfissional } from './register-profissional';

@NgModule({
  declarations: [
    RegisterProfissional
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    RegisterProfissional
  ]
})
export class RegisterProfissionalModule { }
