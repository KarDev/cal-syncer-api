import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { SupabaseService } from '../common/services/supabase.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [GoogleController],
  providers: [GoogleService, SupabaseService],
})
export class GoogleModule {}
