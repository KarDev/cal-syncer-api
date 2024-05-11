import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleModule } from './google/google.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GoogleModule,
    EventsModule,
    ConfigModule.forRoot({
      cache: true,
      envFilePath: `./environments/${process.env.NODE_ENV ? process.env.NODE_ENV : 'local'}.env`,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
