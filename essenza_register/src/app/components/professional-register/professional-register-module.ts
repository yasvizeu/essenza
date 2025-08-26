import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfessionalRegister } from './professional-register';

@NgModule({
  declarations: [
    ProfessionalRegister
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    ProfessionalRegister
  ]
})
export class ProfessionalRegisterModule { }
