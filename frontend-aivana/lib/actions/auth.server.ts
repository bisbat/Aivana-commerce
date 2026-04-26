"use server";

import { cookies } from "next/headers";
import { LoginRequest } from "@/lib/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function loginAction(data: LoginRequest) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return { success: false, message: "INVALID_CREDENTIALS" };
  }

  const { accessToken } = await res.json();

  (await cookies()).set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: process.env.NODE_ENV === "production" ? "/capstone25/cp25ssi3" : "/",
  });

  return { success: true };
}

// REGISTER
export async function registerAction(data: FormData) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers:
        data instanceof FormData ? {} : { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res.json();

      let errorMessage = "เกิดข้อผิดพลาดในการสมัครสมาชิก";

      if (error.message) {
        if (
          error.message.includes("Email") &&
          error.message.includes("already exists")
        ) {
          errorMessage = "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น";
        } else if (
          error.message.includes("Username") &&
          error.message.includes("already exists")
        ) {
          errorMessage = "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่อผู้ใช้อื่น";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        message: errorMessage,
        field: error.message?.includes("Email")
          ? "email"
          : error.message?.includes("Username")
            ? "username"
            : undefined,
      };
    }

    const { accessToken } = await res.json();

    // auto login หลัง register
    (await cookies()).set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path:
        process.env.NODE_ENV === "production" ? "/capstone25/cp25ssi3" : "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์",
    };
  }
}

export async function logoutAction() {
  (await cookies()).set("accessToken", "", {
    httpOnly: true,
    maxAge: 0, // ลบทันที
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/capstone25/cp25ssi3",
  });

  return { success: true };
}

export async function setGoogleTokenAction(token: string) {
  (await cookies()).set("accessToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: process.env.NODE_ENV === "production" ? "/capstone25/cp25ssi3" : "/",
  });
  return { success: true };
}
