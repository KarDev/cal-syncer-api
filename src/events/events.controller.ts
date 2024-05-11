import { Controller, Get, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // @Post()
  // createEvent(@Body() createEventDto: CreateEventDto) {
  //   return this.eventsService.createEvent(createEventDto);
  // }

  @Get()
  getEvents(@Query('userId') userId: string) {
    return this.eventsService.getEvents(userId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventsService.update(+id, updateEventDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventsService.remove(+id);
  // }
}
