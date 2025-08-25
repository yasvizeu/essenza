import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfessionalRegisterComponent } from './professional-register';

@NgModule({
  declarations: [ProfessionalRegisterComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [ProfessionalRegisterComponent]
})
export class ProfessionalRegisterModule {}


