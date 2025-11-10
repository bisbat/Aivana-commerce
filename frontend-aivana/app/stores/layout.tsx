import { Sidebar } from "@/components/layout/Sidebar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
