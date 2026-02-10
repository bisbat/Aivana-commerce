import { getReportByIdAction } from "@/lib/actions/report.actions";
import BackButton from "@/app/admin/components/BackButton";
import ReportDetailCard from "@/app/admin/components/ReportDetailCard";
import BackgroundAivana from "@/components/common/BackgroundAivana";
import { AlertCircle } from "lucide-react";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let report = null;
  let error: string | null = null;

  try {
    report = await getReportByIdAction(Number(id));
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div className="relative mx-auto">
      <BackgroundAivana />
      <div className="relative z-10 max-w-[1200px]">
        <BackButton />

        <h2 className="text-2xl font-bold text-white mb-6">
          รายละเอียดรายงานปัญหา
        </h2>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>Failed to load report detail: {error}</span>
          </div>
        )}

        {/* Pass data to client component */}
        {report && <ReportDetailCard report={report} />}
      </div>
    </div>
  );
}
