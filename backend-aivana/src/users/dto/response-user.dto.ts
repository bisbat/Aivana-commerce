import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  role: string;

  @Expose()
  avatarUrl?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
