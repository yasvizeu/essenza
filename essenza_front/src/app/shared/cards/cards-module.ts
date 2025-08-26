import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cards } from './cards';



@NgModule({
  declarations: [
    Cards
  ],
  imports: [
    CommonModule
  ],
   exports:[
    Cards
   ]
})
export class CardsModule { }
