"use server";
import { cookies } from 'next/headers';
import { decodeJWT } from './types/auth';
import { getUserByUserId } from '@/lib/actions/user.actions';

export async function getCurrentUser() {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded.exp || decoded.exp * 1000 < Date.now()) return null;

  console.log('Decoded JWT:', decoded);

  return getUserByUserId(decoded.sub, token);
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value ?? null;
}
