export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: File | null;
  password: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  role: 'customer' | 'seller' | 'admin';
  iat?: number;
  exp?: number;
}
