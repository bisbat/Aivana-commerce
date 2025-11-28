"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "../components/layout/Navbar";

const ROUTES_WITHOUT_NAVBAR = ["/login", "/register", "/stores", "/seller"];

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldShowNavbar = !ROUTES_WITHOUT_NAVBAR.some((route) => {
    // เช็คว่า pathname เริ่มต้นด้วย route หรือไม่
    return pathname?.startsWith(route);
  });

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
}
