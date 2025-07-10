import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Register } from './register';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




@NgModule({
  declarations: [
    Register
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  exports:[Register]
})
export class RegisterModule { }
