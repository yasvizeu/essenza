import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Register } from './register';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    Register
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[Register]
})
export class RegisterModule { }
