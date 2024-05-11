import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from 'src/common/services/supabase.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);

  constructor(
    private readonly config: ConfigService,
    private dbService: SupabaseService,
    private httpService: HttpService,
  ) {}

  async OAuth2Client(userId?: string) {
    const oAuthClient = new google.auth.OAuth2(
      this.config.get<string>('CALENDER_CLIENT_ID'),
      this.config.get<string>('CALENDER_CLIENT_SECRET'),
      this.config.get<string>('CALENDER_REDIRECT_URI'),
    );

    if (userId) {
      const user = await this.dbService.getUserById(userId);

      if (!!user && user?.refreshToken) {
        oAuthClient.setCredentials({
          refresh_token: user.refreshToken,
        });
      }
    }

    return oAuthClient;
  }

  async getToken(
    state: string,
    code?: string,
  ): Promise<{ token: string; userId: string }> {
    let accessToken: string;

    let oAuthClient = await this.OAuth2Client();
    let user = await this.dbService.getUserById(state);

    if (!user) {
      if (!code) {
        throw new BadRequestException('Invalid request.');
      }

      const { tokens } = await oAuthClient.getToken(code);

      accessToken = tokens.access_token;

      const googleProfile = await this.httpService.axiosRef
        .get('https://www.googleapis.com/oauth2/v1/userinfo', {
          params: {
            alt: 'json',
            access_token: accessToken,
          },
        })
        .catch((er) => {
          this.logger.error(
            `Error while fetching google profile: ${er.message}`,
            er,
          );
          throw er;
        });

      await this.dbService.saveUserToDb(
        state,
        googleProfile.data.id,
        tokens.access_token,
        tokens.refresh_token,
      );
    } else {
      oAuthClient.setCredentials({
        refresh_token: user.refreshToken,
      });

      const { credentials } = await oAuthClient.refreshAccessToken();

      accessToken = credentials.access_token;
      const res = google.calendar({
        version: 'v3',
        auth: oAuthClient,
      });
    }

    return { token: accessToken, userId: state };
  }
}
