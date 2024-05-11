import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { google } from 'googleapis';
import { GoogleService } from '../google/google.service';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(GoogleService.name);

  constructor(private googleService: GoogleService) {}

  createEvent(createEventDto: CreateEventDto) {
    return 'This action adds a new event';
  }

  async getEvents(userId: string) {
    if (!userId) {
      throw new BadRequestException('Invalid request, userId is required');
    }

    const oAuthClient = await this.googleService.OAuth2Client(userId);

    const calendar = google.calendar({
      version: 'v3',
      auth: oAuthClient,
    });

    const res = await calendar.events.list({
      calendarId: 'primary',
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;

    if (!events || events.length === 0) {
      this.logger.log('No events found.');
    }

    return events;
  }
}
