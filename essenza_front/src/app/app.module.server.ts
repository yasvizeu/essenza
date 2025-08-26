import { NgModule } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { App } from './app';
import { AppModule } from './app-module';
import { serverRoutes } from './app.routes.server';
import { HeaderModule } from './shared/header/header-module';
import { FooterModule } from './shared/footer/footer-module';



@NgModule({
  imports: [AppModule, HeaderModule, FooterModule],
  providers: [provideServerRendering(withRoutes(serverRoutes))],
  bootstrap: [App],
})
export class AppServerModule {}
