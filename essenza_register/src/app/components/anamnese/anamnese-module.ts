import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anamnese } from './anamnese';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    Anamnese
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule

  ],
  exports: [Anamnese]
})
export class AnamneseModule { }
