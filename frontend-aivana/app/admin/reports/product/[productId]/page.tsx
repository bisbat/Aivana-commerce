import { getReportsByProductAction } from "@/lib/actions/report.actions";
import type { Report } from "@/lib/types/report";
import BackgroundAivana from "@/components/common/BackgroundAivana";
import { AlertCircle, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductReportsTable from "./components/ProductReportsTable";
import ProductHeader from "./components/ProductHeader";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductReportsPage({ params }: PageProps) {
  const { productId } = await params;
  const productIdNum = parseInt(productId);

  let productReports: Report[] = [];
  let error: string | null = null;

  try {
    productReports = await getReportsByProductAction(productIdNum);
  } catch (e) {
    error = (e as Error).message;
  }

  if (productReports.length === 0) {
    return (
      <div className="relative mx-auto">
        <BackgroundAivana />
        <div className="relative z-10 max-w-[1400px]">
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 text-[#8a57fb] hover:text-[#7145d9] transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>กลับไปหน้ารายงาน</span>
          </Link>
          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-12 text-center">
            <Package size={64} className="mx-auto mb-4 text-slate-600" />
            <h2 className="text-2xl font-bold text-white mb-2">
              ไม่พบรายงานสำหรับสินค้านี้
            </h2>
            <p className="text-slate-400">Product ID: #{productId}</p>
          </div>
        </div>
      </div>
    );
  }

  const product = productReports[0].orderItem.product;
  const pendingCount = productReports.filter(
    (r) => r.status === "pending",
  ).length;
  const underReviewCount = productReports.filter(
    (r) => r.status === "under_review",
  ).length;
  const resolvedCount = productReports.filter(
    (r) => r.status === "resolved",
  ).length;
  const rejectedCount = productReports.filter(
    (r) => r.status === "rejected",
  ).length;

  return (
    <div className="relative mx-auto">
      <BackgroundAivana />
      <div className="relative z-10 max-w-[1400px]">
        {/* Back button */}
        <Link
          href="/admin/reports"
          className="inline-flex items-center gap-2 text-[#8a57fb] hover:text-[#7145d9] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>กลับไปหน้ารายงาน</span>
        </Link>

        {/* Product Header */}
        <ProductHeader
          product={product}
          reportCount={productReports.length}
          pendingCount={pendingCount}
          underReviewCount={underReviewCount}
          resolvedCount={resolvedCount}
          rejectedCount={rejectedCount}
        />

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>Failed to load reports: {error}</span>
          </div>
        )}

        {/* Reports list */}
        <ProductReportsTable reports={productReports} />
      </div>
    </div>
  );
}
