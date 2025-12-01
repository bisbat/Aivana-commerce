"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex">
      <Sidebar currentPath={pathname} />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
