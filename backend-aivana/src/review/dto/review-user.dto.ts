import { Expose, Type } from 'class-transformer';

export class ReviewUserDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  username: string;
}
