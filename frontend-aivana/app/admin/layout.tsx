import Sidebar from "./components/SideBar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#141332] text-slate-200">
      <Sidebar />

      <main className="flex-1 px-10 py-9 overflow-y-auto">{children}</main>
    </div>
  );
}
