import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carousel } from './carousel';



@NgModule({
  declarations: [
    Carousel
  ],
  imports: [
    CommonModule
  ],
  exports:[
    Carousel
  ]
})
export class CarouselModule { }
