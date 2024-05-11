export interface IUser {
  id: number;
  uniqueId: string;
  created_at: Date;
  accessToken: string;
  refreshToken: string;
}
