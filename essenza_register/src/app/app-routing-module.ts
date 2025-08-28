import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Anamnese } from './components/anamnese/anamnese';
import { HomeComponent } from './components/home/home.component';
import { Login } from './components/login/login';
import { Cart } from './components/cart/cart';
import { RegisterProfissional } from './components/register-profissional/register-profissional';
import { Estoque } from './components/estoque/estoque';
import { DashboardProfissional } from './components/dashboard-profissional/dashboard-profissional';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: 'register', component: Register, data: { animation: 'RegisterPage' } },
  { path: 'register-profissional', component: RegisterProfissional, data: { animation: 'RegisterProfissionalPage' } },
  
  // Rotas protegidas que requerem autenticação
  { 
    path: 'cart', 
    component: Cart, 
    canActivate: [AuthGuard],
    data: { animation: 'CartPage' }
  },
  { 
    path: 'anamnese', 
    component: Anamnese, 
    canActivate: [AuthGuard],
    data: { animation: 'AnamnesePage' }
  },
  
  // Rotas que requerem autenticação e role específica
  { 
    path: 'dashboard-profissional', 
    component: DashboardProfissional, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      animation: 'DashboardPage',
      role: 'profissional'
    }
  },
  { 
    path: 'estoque', 
    component: Estoque, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      animation: 'EstoquePage',
      role: 'profissional'
    }
  },
  
  // Rota para logout
  { path: 'logout', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
