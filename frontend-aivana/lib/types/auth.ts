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

export interface TokenPayload {
  sub: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
  sellerId?: string;
}

// Helper function to decode JWT token
export function decodeJWT(token: string): TokenPayload {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error("Invalid token");
  }
}
