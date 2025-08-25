import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { GoogleCalendarService } from '../../services/google-calendar.service';


@Component({
  selector: 'app-client-appointments',
  standalone: false,
  templateUrl: './client-appointments.component.html',
  styleUrls: ['./client-appointments.component.scss']
})
export class ClientAppointmentsComponent implements OnInit {
  loading = false;
  events: any[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: false,
    selectable: false,
    events: []
  };

  constructor(private google: GoogleCalendarService) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      await this.google.initClient();
      this.events = await this.google.listUpcomingEvents('primary');
      this.calendarOptions = { ...this.calendarOptions, events: this.events.map(ev => ({
        id: ev.id,
        title: ev.summary,
        start: ev.start?.dateTime || ev.start?.date,
        end: ev.end?.dateTime || ev.end?.date,
      })) };
    } finally {
      this.loading = false;
    }
  }
}


