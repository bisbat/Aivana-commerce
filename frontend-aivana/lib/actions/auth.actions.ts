import { LoginRequest, LoginResponse, UserProfile } from "@/lib/types/auth";

export async function login(data: LoginRequest): Promise<LoginResponse> {
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

  const result = await response.json();
  return result;
}

export function saveAuthData(data: LoginResponse, userInfo: UserProfile): void {
  localStorage.setItem("accessToken", data.accessToken);
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

export async function getCurrentUser(): Promise<UserProfile> {
  const { accessToken } = getAuthData();

  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("http://localhost:3001/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user profile");
  }

  return response.json();
}
