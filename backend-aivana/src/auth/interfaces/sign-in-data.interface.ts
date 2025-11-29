import { UserRoles } from 'src/constants/user-roles.enum';

export interface SignInData {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  avatarUrl?: string | null;
  sellerId?: string | null;
}
