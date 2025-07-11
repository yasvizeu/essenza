import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from './login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core';

@NgModule({
  declarations: [
    Login
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  exports: [Login]
})
export class LoginModule { }
