"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export const Footer: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setUserRole(user?.role || null);
    };

    checkAuth();
  }, []);

  return (
    <footer className="bg-[var(--linne-purple)] py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center shrink-0">
              <span className="text-3xl font-bold bg-gradient-to-br from-[#8a57fb] to-[#a78bfa] bg-clip-text text-transparent tracking-wide">
                AIVANA
              </span>
            </Link>
            <p className="text-slate-400 text-sm">
              ศูนย์รวม Template & Component
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">หมวดหมู่</h4>
            <ul className="space-y-2">
              {[
                { label: "UI Kit", href: "/products?category=ui-kit" },
                {
                  label: "Frontend Template",
                  href: "/products?category=frontend-template",
                },
                {
                  label: "Backend Template",
                  href: "/products?category=backend-template",
                },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-purple-400 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">เกี่ยวกับเรา</h4>
            <ul className="space-y-2">
              {[
                ...(userRole === "customer"
                  ? [{ label: "สมัครเป็นนักขาย", href: "/seller/become" }]
                  : []),
                { label: "เกี่ยวกับเรา", href: "/about" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-purple-400 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
