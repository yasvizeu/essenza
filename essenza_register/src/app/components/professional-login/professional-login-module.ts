import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfessionalLoginComponent } from './professional-login';

@NgModule({
  declarations: [ProfessionalLoginComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [ProfessionalLoginComponent]
})
export class ProfessionalLoginModule {}


