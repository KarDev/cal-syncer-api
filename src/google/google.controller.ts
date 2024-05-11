import { Controller, Get, Query, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { getUniqueId } from '../common/IdGenerator';
import { ConfigService } from '@nestjs/config';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private config: ConfigService,
  ) {}

  @Get('')
  async getAuthUrl(): Promise<{ url: string }> {
    let oAuthClient = await this.googleService.OAuth2Client();

    const url = oAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ' openid profile https://www.googleapis.com/auth/calendar.events',
      prompt: 'consent',
      state: getUniqueId(),
    });

    return { url: url };
  }

  @Get('redirect')
  async redirect(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: any,
  ) {
    let frontendUrl = this.config.get<string>('APP_URL');

    const { userId } = await this.googleService.getToken(state, code);

    res.redirect(frontendUrl + '/?userId=' + userId);
  }

  @Get('refresh')
  async refresh(
    @Query('state') state: string,
  ): Promise<{ token: string; userId: string }> {
    return await this.googleService.getToken(state);
  }
}
