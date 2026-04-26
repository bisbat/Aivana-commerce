"use server";

import { cookies } from "next/headers";
import { decodeJWT } from "./utils/jwt";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { isTokenExpired } from "./utils/jwt";

export async function getCurrentUser() {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return null;

  if (isTokenExpired(token)) return null;

  const decoded = decodeJWT(token);

  return getUserByUserId(decoded?.sub ?? "");
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value ?? null;
}
