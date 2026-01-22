import { Expose } from 'class-transformer';
import { Role } from '../enum/role.enum';

export class AuthUserDto {
  @Expose()
  userId: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: Role;

  @Expose()
  avatarUrl?: string;

  @Expose()
  sellerId?: string | null;
}

export class AuthResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  user: AuthUserDto;
}
