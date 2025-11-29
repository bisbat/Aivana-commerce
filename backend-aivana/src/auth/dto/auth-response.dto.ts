import { Expose } from 'class-transformer';
import { UserRoles } from 'src/constants/user-roles.enum';

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
  role: UserRoles;

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
