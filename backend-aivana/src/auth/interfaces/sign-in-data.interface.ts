import { Role } from "../enum/role.enum";

export interface SignInData {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatarUrl?: string | null;
  sellerId?: string | null;
}
