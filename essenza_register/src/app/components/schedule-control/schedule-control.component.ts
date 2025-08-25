import { Component, OnInit } from '@angular/core';
import { GoogleCalendarService } from '../../services/google-calendar.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventDropArg, DateSelectArg } from '@fullcalendar/core';

@Component({
  selector: 'app-schedule-control',
  standalone: false,
  templateUrl: './schedule-control.component.html',
  styleUrls: ['./schedule-control.component.scss']
})
export class ScheduleControlComponent implements OnInit {

  loading = false;
  events: any[] = [];
  view: 'week' | 'month' = 'week';
  calendars: { id: string; summary: string }[] = [];
  selectedCalendarId = 'primary';
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    editable: true,
    selectable: true,
    eventDrop: (arg) => this.onEventDrop(arg),
    select: (arg) => this.onDateSelect(arg),
    eventClick: (info) => this.editEvent(info.event.id),
    events: [],
  };

  constructor(private google: GoogleCalendarService) {}

  ngOnInit(): void {
    this.init();
  }

  async init(): Promise<void> {
    this.loading = true;
    try {
      await this.google.initClient();
      await this.loadCalendars();
      await this.loadEvents();
    } finally {
      this.loading = false;
    }
  }

  async loadCalendars(): Promise<void> {
    this.calendars = await this.google.listCalendars();
  }

  async loadEvents(): Promise<void> {
    this.events = await this.google.listUpcomingEvents(this.selectedCalendarId);
    this.calendarOptions = { ...this.calendarOptions, events: this.events.map(ev => ({
      id: ev.id,
      title: ev.summary,
      start: ev.start?.dateTime || ev.start?.date,
      end: ev.end?.dateTime || ev.end?.date,
    })) };
  }

  async addEvent(): Promise<void> {
    const summary = prompt('Título do evento:');
    if (!summary) return;
    const start = prompt('Início (YYYY-MM-DDTHH:MM:SSZ):');
    const end = prompt('Fim (YYYY-MM-DDTHH:MM:SSZ):');
    if (!start || !end) return;
    await this.google.createEvent(this.selectedCalendarId, { summary, start: { dateTime: start }, end: { dateTime: end } });
    await this.loadEvents();
  }

  async editEvent(eventId: string): Promise<void> {
    const summary = prompt('Novo título/serviço:');
    if (!summary) return;
    const description = prompt('Descrição (ex.: Cliente, observações):') || undefined;
    await this.google.updateEvent(this.selectedCalendarId, eventId, { summary, description });
    await this.loadEvents();
  }

  async deleteEvent(eventId: string): Promise<void> {
    const ok = confirm('Excluir este evento?');
    if (!ok) return;
    await this.google.deleteEvent(this.selectedCalendarId, eventId);
    await this.loadEvents();
  }

  async onEventDrop(arg: EventDropArg): Promise<void> {
    await this.google.updateEvent(this.selectedCalendarId, arg.event.id, {
      start: { dateTime: arg.event.start?.toISOString() },
      end: { dateTime: arg.event.end?.toISOString() }
    });
  }

  async onDateSelect(arg: DateSelectArg): Promise<void> {
    const title = prompt('Título do evento:');
    if (!title) return;
    await this.google.createEvent(this.selectedCalendarId, {
      summary: title,
      start: { dateTime: arg.startStr },
      end: { dateTime: arg.endStr }
    });
    await this.loadEvents();
  }
}


