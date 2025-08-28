import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardProfissional } from './dashboard-profissional';

@NgModule({
  declarations: [
    DashboardProfissional
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    DashboardProfissional
  ]
})
export class DashboardProfissionalModule { }

