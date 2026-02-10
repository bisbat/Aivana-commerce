import Sidebar from "./components/SideBar";

// ─── Global keyframes injected once at the layout level ─────────────────────
// All pages under /admin share these animations — no need to repeat them

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#141332] text-slate-200">
      <Sidebar />

      {/* Main content area — shared padding & scroll behaviour */}
      <main className="flex-1 px-10 py-9 overflow-y-auto">{children}</main>
    </div>
  );
}
