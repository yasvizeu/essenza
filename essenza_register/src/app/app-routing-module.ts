import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Anamnese } from './components/anamnese/anamnese';
import { HomeComponent } from './components/home/home.component';
import { Login } from './components/login/login';
import { Cart } from './components/cart/cart';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: 'cart', component: Cart, pathMatch: 'full' },
  { path: 'register', component: Register, data: { animation: 'RegisterPage' } },
  { path: 'anamnese', component: Anamnese, data: { animation: 'AnamnesePage' } }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
