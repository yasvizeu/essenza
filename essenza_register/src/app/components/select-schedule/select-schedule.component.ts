import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { GoogleCalendarService } from '../../services/google-calendar.service';
import { RegistroStateService } from '../../services/registro-state.service';

@Component({
  selector: 'app-select-schedule',
  standalone: false,
  templateUrl: './select-schedule.component.html',
  styleUrls: ['./select-schedule.component.scss']
})
export class SelectScheduleComponent {
  date = '';
  time = '';
  durationMinutes = 60;
  creating = false;
  slots: { time: string; label: string; booked: boolean }[] = [];

  constructor(private booking: BookingService, private google: GoogleCalendarService, private router: Router, private registro: RegistroStateService) {}

  async loadSlots(): Promise<void> {
    this.time = '';
    this.slots = [];
    if (!this.date) return;

    const workStart = '08:00';
    const workEnd = '18:00';
    const tzDate = new Date(`${this.date}T00:00:00`);
    const timeMinIso = new Date(`${this.date}T${workStart}:00`).toISOString();
    const timeMaxIso = new Date(`${this.date}T${workEnd}:00`).toISOString();

    await this.google.initClient();
    const events = await this.google.listEventsInRange('primary', timeMinIso, timeMaxIso);

    // Build all slots within working hours
    const step = 30; // minutes
    const toMinutes = (hhmm: string) => {
      const [h, m] = hhmm.split(':').map(Number); return h * 60 + m;
    };
    const startMin = toMinutes(workStart);
    const endMin = toMinutes(workEnd);

    const existsOverlap = (slotStartIso: string, slotEndIso: string) => {
      const s = new Date(slotStartIso).getTime();
      const e = new Date(slotEndIso).getTime();
      return events.some(ev => {
        const evS = new Date(ev.start?.dateTime || ev.start?.date).getTime();
        const evE = new Date(ev.end?.dateTime || ev.end?.date).getTime();
        return Math.max(s, evS) < Math.min(e, evE);
      });
    };

    for (let m = startMin; m + this.durationMinutes <= endMin; m += step) {
      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      const startIso = new Date(`${this.date}T${hh}:${mm}:00`).toISOString();
      const endDate = new Date(`${this.date}T${hh}:${mm}:00`);
      endDate.setMinutes(endDate.getMinutes() + this.durationMinutes);
      const endIso = endDate.toISOString();
      const booked = existsOverlap(startIso, endIso);
      this.slots.push({ time: `${hh}:${mm}`, label: `${hh}:${mm}`, booked });
    }
  }

  selectSlot(slot: { time: string; booked: boolean }): void {
    if (slot.booked) return;
    this.time = slot.time;
  }

  async confirmar(): Promise<void> {
    const payload = this.booking.get();
    if (!payload) { alert('Carrinho vazio.'); return; }
    if (!this.date || !this.time) { alert('Escolha data e hora.'); return; }

    const startIso = new Date(`${this.date}T${this.time}:00`).toISOString();
    const end = new Date(`${this.date}T${this.time}:00`);
    end.setMinutes(end.getMinutes() + this.durationMinutes);
    const endIso = end.toISOString();

    this.creating = true;
    try {
      await this.google.initClient();
      const serviceName = this.booking.getSelectedService() || payload.items.map(i => i.name).join(', ');
      const cliente = this.registro.getDadosRegistro();
      const clienteNome = cliente?.name || 'Cliente';
      const title = serviceName;
      await this.google.createEvent('primary', {
        summary: title,
        description: `Cliente: ${clienteNome}\nServiços: ${serviceName}`,
        start: { dateTime: startIso },
        end: { dateTime: endIso }
      });
      this.booking.clear();
      alert('Agendamento realizado!');
      this.router.navigate(['/meus-agendamentos']);
    } finally {
      this.creating = false;
    }
  }
}


