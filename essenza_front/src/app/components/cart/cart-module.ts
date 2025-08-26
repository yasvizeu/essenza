import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart } from './cart';



@NgModule({
  declarations: [
    Cart
  ],
  imports: [
    CommonModule
  ],
  exports: [Cart]
})
export class CartModule { }
