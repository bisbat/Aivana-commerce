export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface UserProfile {
  sub: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}
