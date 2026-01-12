'use client';

import { LoginRequest, TokenResponse, decodeJWT } from "@/lib/types/auth";
import { UserProfile } from "@/lib/types/user.ts/user";
import { getUserByUserId } from "./user.actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const result: TokenResponse = await response.json();

  return result;
}

export function saveAuthData(token: string): void {
  localStorage.setItem("accessToken", token);
  window.dispatchEvent(new Event("authStateChanged"));
}

export function clearAuthData(): void {
  localStorage.removeItem("accessToken");
  window.dispatchEvent(new Event("authStateChanged"));
}

// สมัครสมาชิกใหม่
export async function register(data: FormData): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers:
      data instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json",
          },
    body: data instanceof FormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  const result: TokenResponse = await response.json();

  return result;
}

// อ่าน token จาก localStorage
export function getAuthData(): {
  accessToken: string | null;
} {
  const accessToken = localStorage.getItem("accessToken");

  return {
    accessToken,
  };
}

// เอา accessToken → decode → ดึง user profile
export async function getCurrentUserFromToken(): Promise<UserProfile | null> {
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

    const userProfile = await getUserByUserId(decoded.sub, accessToken);

    if (!userProfile) {
      return null;
    }
    return userProfile;
  } catch (error) {
    clearAuthData();
    return null;
  }
}
