import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IUser } from '../types';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    this.supabase = createClient(
      this.config.get<string>('SUPABASE_URL'),
      this.config.get<string>('SUPABASE_ANON_KEY'),
    );
  }

  async getUserById(uniqueId: string): Promise<IUser> {
    const { data, error } = await this.supabase
      .from('user')
      .select()
      .eq('uniqueId', uniqueId)
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return data[0] as unknown as IUser;
  }

  async saveUserToDb(
    uniqueId: string,
    googleId: string,
    accessToken: string,
    refreshToken: string,
  ) {
    const { data, error } = await this.supabase.from('user').insert({
      uniqueId: uniqueId,
      googleId: googleId,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
