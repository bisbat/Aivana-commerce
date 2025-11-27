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

export function saveAuthData(token: string, userInfo: UserProfile): void {
  localStorage.setItem("accessToken", token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: userInfo.sub,
      username: userInfo.username,
      role: userInfo.role,
    })
  );
}

export function clearAuthData(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
}

export function getAuthData(): {
  accessToken: string | null;
  user: { id: string; username: string; role: string } | null;
} {
  const accessToken = localStorage.getItem("accessToken");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    accessToken,
    user,
  };
}

export function getCurrentUserFromToken(): UserProfile | null {
  const { accessToken } = getAuthData();

  if (!accessToken) {
    return null;
  }

  try {
    const decoded = decodeJWT(accessToken);

    // Check if token is expired
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

// Validate token by making API call
export async function validateTokenWithBackend(): Promise<boolean> {
  const { accessToken } = getAuthData();

  if (!accessToken) {
    return false;
  }

  try {
    await fetch("http://localhost:3001/auth/me", {
      method: "GET",
    });
    return true;
  } catch (error) {
    return false;
  }
}
