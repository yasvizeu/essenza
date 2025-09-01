import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ClienteCadastroComponent } from './components/cliente-cadastro/cliente-cadastro';
import { LoginComponent } from './components/login/login';
import { DashboardProfissionalComponent } from './components/dashboard-profissional/dashboard-profissional';
import { Sobre } from './pages/sobre/sobre';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'sobre', component: Sobre },
  { path: 'cadastro', component: ClienteCadastroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard-profissional', component: DashboardProfissionalComponent },
  { path: '**', redirectTo: '' }
];
