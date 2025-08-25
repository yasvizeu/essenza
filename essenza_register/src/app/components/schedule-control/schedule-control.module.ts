import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleControlComponent } from './schedule-control.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ScheduleControlComponent],
  imports: [CommonModule, FullCalendarModule, FormsModule],
  exports: [ScheduleControlComponent]
})
export class ScheduleControlModule {}


