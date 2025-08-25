import { Injectable } from '@angular/core';

declare const gapi: any;

@Injectable({ providedIn: 'root' })
export class GoogleCalendarService {
  private initialized = false;

  // TODO: Substitua pelos seus IDs/Keys reais
  private readonly CLIENT_ID = 'GOOGLE_CLIENT_ID.apps.googleusercontent.com';
  private readonly API_KEY = 'GOOGLE_API_KEY';
  private readonly SCOPES = 'https://www.googleapis.com/auth/calendar';
  private readonly DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

  async initClient(): Promise<void> {
    if (this.initialized) return;
    await this.loadGapi();
    await new Promise<void>((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: this.API_KEY,
            clientId: this.CLIENT_ID,
            discoveryDocs: [this.DISCOVERY_DOC],
            scope: this.SCOPES,
          });
          if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            await gapi.auth2.getAuthInstance().signIn();
          }
          this.initialized = true;
          resolve();
        } catch (e) { reject(e); }
      });
    });
  }

  private loadGapi(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).gapi) return resolve();
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject('Falha ao carregar gapi');
      document.body.appendChild(script);
    });
  }

  async listCalendars(): Promise<{ id: string; summary: string }[]> {
    const res = await gapi.client.calendar.calendarList.list();
    return (res.result.items || []).map((c: any) => ({ id: c.id, summary: c.summary }));
  }

  async listUpcomingEvents(calendarId: string = 'primary'): Promise<any[]> {
    const res = await gapi.client.calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 50,
      orderBy: 'startTime',
    });
    return res.result.items || [];
  }

  async listEventsInRange(calendarId: string, timeMinIso: string, timeMaxIso: string): Promise<any[]> {
    const res = await gapi.client.calendar.events.list({
      calendarId,
      timeMin: timeMinIso,
      timeMax: timeMaxIso,
      showDeleted: false,
      singleEvents: true,
      maxResults: 250,
      orderBy: 'startTime',
    });
    return res.result.items || [];
  }

  async createEvent(calendarId: string, event: any): Promise<any> {
    const res = await gapi.client.calendar.events.insert({
      calendarId,
      resource: event,
    });
    return res.result;
  }

  async updateEvent(calendarId: string, eventId: string, updates: any): Promise<any> {
    const res = await gapi.client.calendar.events.patch({
      calendarId,
      eventId,
      resource: updates,
    });
    return res.result;
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    await gapi.client.calendar.events.delete({ calendarId, eventId });
  }
}


