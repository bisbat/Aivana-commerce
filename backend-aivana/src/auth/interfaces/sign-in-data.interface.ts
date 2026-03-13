import { Role } from '../enum/role.enum';

export interface SignInData {
  userId: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  avatarUrl?: string | null;
  sellerId?: string | null;
}
