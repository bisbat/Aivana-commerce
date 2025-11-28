"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "../components/layout/Navbar";

const ROUTES_WITHOUT_NAVBAR = [
  "/login",
  "/register",
  "/seller/become",
];

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldShowNavbar = !ROUTES_WITHOUT_NAVBAR.includes(pathname || "");

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
}
