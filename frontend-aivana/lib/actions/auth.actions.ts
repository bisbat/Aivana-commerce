import {
  LoginRequest,
  LoginResponse,
  UserProfile,
  decodeJWT,
} from "@/lib/types/auth";

export async function login(
  data: LoginRequest
): Promise<{ token: LoginResponse; user: UserProfile }> {
  const response = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const result: LoginResponse = await response.json();
  const userInfo = decodeJWT(result.accessToken);

  return { token: result, user: userInfo };
}

export function saveAuthData(token: string): void {
  localStorage.setItem("accessToken", token);
}

export function clearAuthData(): void {
  localStorage.removeItem("accessToken");
}

export function getCurrentUserFromToken(): UserProfile | null {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return null;
  }

  try {
    const decoded = decodeJWT(accessToken);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      clearAuthData();
      return null;
    }

    return decoded;
  } catch (error) {
    clearAuthData();
    return null;
  }
}
