import Sidebar from "./components/SideBar";

// ─── Global keyframes injected once at the layout level ─────────────────────
// All pages under /admin share these animations — no need to repeat them

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Geist', 'SF Pro Display', system-ui, sans-serif",
        background: "#0f1117",
        color: "#e2e8f0",
      }}
    >
      <Sidebar />

      {/* Main content area — shared padding & scroll behaviour */}
      <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}