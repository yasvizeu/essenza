import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsModule } from '../../shared/cards/cards-module'
import { CarouselModule } from '../../shared/carousel/carousel-module';
import { AppRoutingModule } from '../../app-routing-module'



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    CardsModule,
    CarouselModule,
    AppRoutingModule
  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }
