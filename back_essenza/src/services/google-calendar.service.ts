import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { googleCalendarConfig } from '../config/google-calendar.config';

@Injectable()
export class GoogleCalendarService {
  private oauth2Client = new google.auth.OAuth2(
    googleCalendarConfig.clientId,
    googleCalendarConfig.clientSecret,
    googleCalendarConfig.redirectUri
  );

  // Gerar URL de autorização
  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: googleCalendarConfig.scopes,
      prompt: 'consent'
    });
  }

  // Trocar código por token
  async getToken(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  // Criar evento no Google Calendar
  async createEvent(eventData: any) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    
    const event = {
      summary: eventData.title,
      description: eventData.description,
      start: {
        dateTime: eventData.start.dateTime,
        timeZone: eventData.start.timeZone,
      },
      end: {
        dateTime: eventData.end.dateTime,
        timeZone: eventData.end.timeZone,
      },
      attendees: eventData.attendees,
      location: eventData.location,
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event, // ✅ Correção aqui
    });

    return response.data;
  }
}