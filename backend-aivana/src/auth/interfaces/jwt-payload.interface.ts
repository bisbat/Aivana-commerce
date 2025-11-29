import { UserRoles } from 'src/constants/user-roles.enum';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  username: string;
  role: UserRoles;
  sellerId?: string | null;
}
