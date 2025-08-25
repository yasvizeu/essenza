import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientAppointmentsComponent } from './client-appointments.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [ClientAppointmentsComponent],
  imports: [CommonModule, FullCalendarModule],
  exports: [ClientAppointmentsComponent]
})
export class ClientAppointmentsModule {}


