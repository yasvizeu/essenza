import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Anamnese } from './components/anamnese/anamnese';
import { HomeComponent } from './components/home/home.component';
import { Login } from './components/login/login.component';
import { Cart } from './components/cart/cart';
import { DashboardProfissionalComponent } from './components/dashboard-profissional/dashboard-profissional.component';
import { HomeClienteComponent } from './components/home/home-cliente/home-cliente.component';
import { HomeProfissionalComponent } from './components/home/home-profissional/home-profissional.component';
import { TestRoutingComponent } from './components/test-routing/test-routing.component';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { ServicosComponent } from './components/servicos/servicos.component';
import { ProfessionalGuard } from './guards/professional.guard';
import { ClientGuard } from './guards/client.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: 'cart', component: Cart, pathMatch: 'full' },
  { path: 'register', component: Register, data: { animation: 'RegisterPage' } },
  { path: 'anamnese', component: Anamnese, data: { animation: 'AnamnesePage' } },
  { path: 'dashboard-profissional', component: DashboardProfissionalComponent, canActivate: [ProfessionalGuard], data: { animation: 'DashboardPage' } },
  { path: 'home-cliente', component: HomeClienteComponent, canActivate: [ClientGuard], data: { animation: 'HomeClientePage' } },
  { path: 'home-profissional', component: HomeProfissionalComponent, canActivate: [ProfessionalGuard], data: { animation: 'HomeProfissionalPage' } },
  { path: 'test-routing', component: TestRoutingComponent, data: { animation: 'TestPage' } },
  // Rotas para estoque e serviços
  { path: 'estoque', component: EstoqueComponent, canActivate: [ProfessionalGuard], data: { animation: 'EstoquePage' } },
  { path: 'servicos', component: ServicosComponent, canActivate: [ProfessionalGuard], data: { animation: 'ServicosPage' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
