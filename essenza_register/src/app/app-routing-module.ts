import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { Register } from './components/register/register';
import { Anamnese } from './components/anamnese/anamnese';

const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: Register, data: { animation: 'RegisterPage' } },
  { path: 'anamnese', component: Anamnese, data: { animation: 'AnamnesePage' } }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
