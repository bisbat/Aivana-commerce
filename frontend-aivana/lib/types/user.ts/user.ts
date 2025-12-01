export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  sellerId?: string | null;
}
