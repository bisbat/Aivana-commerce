"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "../components/layout/Navbar";

const ROUTES_WITHOUT_NAVBAR = [
  "/login",
  "/register",
  "/stores",
  "/payment",
  "/admin",
];

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldShowNavbar = !ROUTES_WITHOUT_NAVBAR.some((route) => {
    return pathname?.startsWith(route);
  });

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
}
