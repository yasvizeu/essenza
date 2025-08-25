import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectScheduleComponent } from './select-schedule.component';

@NgModule({
  declarations: [SelectScheduleComponent],
  imports: [CommonModule, FormsModule],
  exports: [SelectScheduleComponent]
})
export class SelectScheduleModule {}


