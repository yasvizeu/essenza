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
import { RegisterProfissionalModule } from './components/register-profissional/register-profissional-module';
import { DashboardProfissionalModule } from './components/dashboard-profissional/dashboard-profissional-module';


import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [
    App
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
    RegisterProfissionalModule,
    DashboardProfissionalModule
    
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor])
    ),
  ],
  bootstrap: [App]
})
export class AppModule { }
