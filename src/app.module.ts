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
      envFilePath: `${process.env.PROD_ENV ? './environments/production.env' : '.env'}`,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
