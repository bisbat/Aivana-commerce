"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setGoogleTokenAction } from "@/lib/actions/auth.server";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login?error=google_failed");
      return;
    }

    setGoogleTokenAction(token)
      .then(() => {
        router.replace("/");
      })
      .catch(() => {
        router.replace("/login?error=google_failed");
      });
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-(--primary) border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">กำลังเข้าสู่ระบบ...</p>
      </div>
    </div>
  );
}
