import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from './product-detail.component';

@NgModule({
  declarations: [ProductDetailComponent],
  imports: [CommonModule],
  exports: [ProductDetailComponent]
})
export class ProductDetailModule {}


