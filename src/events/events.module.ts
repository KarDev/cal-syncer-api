import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { GoogleService } from '../google/google.service';
import { SupabaseService } from '../common/services/supabase.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [EventsController],
  providers: [EventsService, GoogleService, SupabaseService],
})
export class EventsModule {}
