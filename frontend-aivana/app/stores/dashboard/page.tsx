import { fetchSellerDashboard } from "@/lib/actions/dashboard.actions";
import DashboardStats from "@/components/seller/DashboardStats";
import SalesChart from "@/components/seller/SalesChart";
import TopProductsTable from "@/components/seller/TopProductsTable";

export default async function DashboardPage() {
  let data = null;
  let error: string | null = null;
 
  try {
    data = await fetchSellerDashboard();
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1400 }}>
      {/* Page title */}
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 28 }}>
        แนวโน้มยอดขาย
      </h1>

      {/* Error state */}
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12,
            padding: "16px 20px",
            color: "#f87171",
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          Failed to load dashboard: {error}
        </div>
      )}

      {data && (
        <>
          {/* Top row: Chart + Stats */}
          <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
            {/* Chart (left - 65%) */}
            <div style={{ flex: "0 0 65%" }}>
              <SalesChart data={data.monthlyPerformance} />
            </div>

            {/* Stats cards (right - 35%) */}
            <div style={{ flex: "0 0 35%" }}>
              <DashboardStats
                totalItemsSold={data.totalItemsSold}
                totalRevenue={data.totalRevenue}
              />
            </div>
          </div>

          {/* Bottom: Top products table */}
          <TopProductsTable products={data.topSellingProducts} />
        </>
      )}
    </div>
  );
}