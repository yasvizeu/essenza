import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anamnese } from './anamnese';



@NgModule({
  declarations: [
    Anamnese
  ],
  imports: [
    CommonModule
  ],
  exports: [Anamnese]
})
export class AnamneseModule { }
