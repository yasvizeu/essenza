import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { Register } from './components/register/register';
import { Anamnese } from './components/anamnese/anamnese';
import { HomeComponent } from './components/home/home.component';
import { Login } from './components/login/login';
import { Cart } from './components/cart/cart';
import { ProfessionalRegisterComponent } from './components/professional-register/professional-register';
import { ProfessionalLoginComponent } from './components/professional-login/professional-login';
import { RoleGuard } from './services/role.guard';
import { ScheduleControlComponent } from './components/schedule-control/schedule-control.component';
import { ClientAppointmentsComponent } from './components/client-appointments/client-appointments.component';
import { ClientGuard } from './services/client.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: 'cart', component: Cart, pathMatch: 'full' },
  { path: 'register', component: Register, data: { animation: 'RegisterPage' } },
  { path: 'register-professional', component: ProfessionalRegisterComponent, data: { animation: 'RegisterProfessionalPage' } },
  { path: 'profissional-login', component: ProfessionalLoginComponent, pathMatch: 'full' },
  { path: 'anamnese', component: Anamnese, data: { animation: 'AnamnesePage' } },
  { path: 'agenda', component: ScheduleControlComponent, canActivate: [AuthGuard, RoleGuard] }
  ,{ path: 'meus-agendamentos', component: ClientAppointmentsComponent, canActivate: [AuthGuard, ClientGuard] }
  ,{ path: 'selecionar-horario', loadChildren: () => import('./components/select-schedule/select-schedule.module').then(m => m.SelectScheduleModule) }
  ,{ path: 'produto/:id', loadChildren: () => import('./components/product-detail/product-detail.module').then(m => m.ProductDetailModule) }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
