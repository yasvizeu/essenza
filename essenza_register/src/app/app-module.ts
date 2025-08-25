import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';


import { RegisterModule } from './components/register/register-module';
import { AnamneseModule } from './components/anamnese/anamnese-module';
import { HomeModule } from './components/home/home.module';
import { CardsModule } from './shared/cards/cards-module';
import { CarouselModule } from './shared/carousel/carousel-module';
import { FooterModule } from './shared/footer/footer-module';
import { HeaderModule } from './shared/header/header-module';
import { LoginModule } from './components/login/login-module';
import { CartModule } from './components/cart/cart-module';
import { ProfessionalRegisterModule } from './components/professional-register/professional-register-module';
import { ProfessionalLoginModule } from './components/professional-login/professional-login-module';
import { ScheduleControlModule } from './components/schedule-control/schedule-control.module';
import { ClientAppointmentsModule } from './components/client-appointments/client-appointments.module';
import { SelectScheduleModule } from './components/select-schedule/select-schedule.module';
import { ProductDetailModule } from './components/product-detail/product-detail.module';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';


@NgModule({
  declarations: [
    App,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RegisterModule,
    AnamneseModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HomeModule,
    LoginModule,
    CardsModule,
    FooterModule,
    HeaderModule,
    CarouselModule,
    CartModule,
    ProfessionalRegisterModule,
    ProfessionalLoginModule,
    ScheduleControlModule,
    ClientAppointmentsModule,
    SelectScheduleModule,
    ProductDetailModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
  ],
  bootstrap: [App]
})
export class AppModule { }
