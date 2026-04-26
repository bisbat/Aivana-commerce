import { Expose, Transform } from 'class-transformer';

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
  avatarUrl?: string;

  @Expose()
  bio?: string;

  @Expose()
  role: string;

  @Expose()
  @Transform(({ obj }) => obj.sellerProfile?.id || null)
  sellerId?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
