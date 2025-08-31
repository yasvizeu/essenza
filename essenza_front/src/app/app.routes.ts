import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ClienteCadastroComponent } from './components/cliente-cadastro/cliente-cadastro';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'cadastro', component: ClienteCadastroComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
