import { JwtPayload } from '../types/auth';

export function decodeJWT(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    console.log("Decoded JWT Payload:", jsonPayload);
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function getRoleFromToken(token: string) {
  return decodeJWT(token)?.role;
}

export function getUserIdFromToken(token: string) {
  return decodeJWT(token)?.sub;
}

export function isTokenExpired(token: string) {
  const payload = decodeJWT(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  return payload.exp * 1000 < Date.now();
}
