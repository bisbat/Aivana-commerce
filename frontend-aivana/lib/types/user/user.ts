export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  sellerId?: string | null;
}
