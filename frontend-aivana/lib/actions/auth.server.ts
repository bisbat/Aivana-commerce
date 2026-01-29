'use server';
import { cookies } from 'next/headers';
import { LoginRequest } from '@/lib/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function loginAction(data: LoginRequest) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Login failed');
  }

  const { accessToken } = await res.json();

  (await cookies()).set('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    // secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: process.env.NODE_ENV === 'production' ? '/capstone25/cp25ssi3' : '/',
  });

  return { success: true };
}


// REGISTER
export async function registerAction(data: FormData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers:
      data instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Register failed');
  }

  const { accessToken } = await res.json();

  // auto login หลัง register
  (await cookies()).set('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    // secure: process.env.NODE_ENV === 'production',
    path: process.env.NODE_ENV === 'production' ? '/capstone25/cp25ssi3' : '/',
  });

  return { success: true };
}

export async function logoutAction() {
  (await cookies()).set('accessToken', '', {
    httpOnly: true,
    maxAge: 0, // ลบทันที
    sameSite: 'lax',
    // secure: process.env.NODE_ENV === 'production',
    path: process.env.NODE_ENV === 'production' ? '/capstone25/cp25ssi3' : '/',
  });

  return { success: true };
}
