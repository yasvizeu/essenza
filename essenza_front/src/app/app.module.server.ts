import { NgModule } from '@angular/core';
import { App } from './app';
import { AppModule } from './app-module';
import { HeaderModule } from './shared/header/header-module';
import { FooterModule } from './shared/footer/footer-module';

@NgModule({
  imports: [AppModule, HeaderModule, FooterModule],
  providers: [],
  bootstrap: [App],
})
export class AppServerModule {}
