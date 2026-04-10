import { notFound } from "next/navigation";
import { Product } from "@/lib/types/product/Product";
import EditButton from "./EditButton";
import BackButton from "./BackButton";
import ProductImages from "./ProductImages";
import DeleteButton from "./DeleteButton";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import {
  getProductByIdAction,
  getProductHasOrdersAction,
} from "@/lib/actions/product.actions";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";

async function getProductData(productId: string): Promise<Product | null> {
  const productData = await getProductByIdAction(productId);
  return productData || null;
}

type PageProps = {
  params: Promise<{ productId: string }>;
};

function parseInstallationGuide(raw: string): string[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
  } catch {
    // not JSON — fall through
  }
  return null;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-px flex-1 bg-white/[0.06]" />
      <h3 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-white/30 whitespace-nowrap">
        {children}
      </h3>
      <div className="h-px flex-1 bg-white/[0.06]" />
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/[0.08] text-xs text-white/70 font-medium">
      {children}
    </span>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
      <span className="text-xs text-white/30 w-28 shrink-0 pt-0.5 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex-1 text-sm text-white/80">{children}</div>
    </div>
  );
}

export default async function ProductStoreDetailPage({ params }: PageProps) {
  const productId = (await params).productId;

  const [initialProductData, hasOrders] = await Promise.all([
    getProductData(productId),
    getProductHasOrdersAction(productId),
  ]);

  if (!initialProductData) notFound();

  const installationSteps = initialProductData.installationGuide
    ? parseInstallationGuide(initialProductData.installationGuide)
    : null;

  return (
    <div className="min-h-screen text-white">

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-800/[0.08] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-800/[0.06] blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-8">

        {/* Top action bar */}
        <div className="flex items-center justify-between mb-8">
          <BackButton />
          <div className="flex items-center gap-3">
            <DeleteButton
              productId={productId}
              productName={initialProductData.name}
              hasOrders={hasOrders}
            />
            <EditButton productId={productId} />
          </div>
        </div>

        {/* ── Images at the TOP ─────────────────────────────────────── */}
        <div className="mb-8">
          <ProductImages
            heroSrc={initialProductData.heroImageUrl}
            detailImages={initialProductData.detailImages}
          />
        </div>

        {/* ── Product info — single column below images ──────────────── */}
        <div className="space-y-6">

          {/* Name, price, tags */}
          <div className="relative rounded-2xl border border-white/[0.07] bg-[#15132a]/60 backdrop-blur-sm p-8 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-violet-400/70 mb-3">
              {initialProductData.category.name}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              {initialProductData.name}
            </h1>
            {initialProductData.blurb && (
              <p className="text-white/50 text-sm mb-5">{initialProductData.blurb}</p>
            )}

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <span className="text-xs text-violet-400 font-medium uppercase tracking-wide">Price</span>
              <span className="text-xl font-bold text-white">
                {formatPriceWithCurrency(initialProductData.price)}
              </span>
            </div>

            {initialProductData.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {initialProductData.tags.map((tag) => (
                  <Pill key={tag.id}>{tag.name}</Pill>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          {initialProductData.description && (
            <div className="rounded-2xl border border-white/[0.06] bg-[#13112a]/50 p-6">
              <SectionHeader>Description</SectionHeader>
              <p className="text-white/70 text-sm leading-relaxed">
                {initialProductData.description}
              </p>
            </div>
          )}

          {/* Installation Guide */}
          {initialProductData.installationGuide && (
            <div className="rounded-2xl border border-white/[0.06] bg-[#13112a]/50 p-6">
              <SectionHeader>Installation Guide</SectionHeader>
              {installationSteps ? (
                <ol className="space-y-3">
                  {installationSteps.map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-white/75 leading-relaxed pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <MarkdownRenderer content={initialProductData.installationGuide} />
              )}
            </div>
          )}

          {/* Features */}
          {initialProductData.features?.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-[#13112a]/50 p-6">
              <SectionHeader>Features</SectionHeader>
              <ul className="space-y-2">
                {initialProductData.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/75">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical details */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#13112a]/50 p-6">
            <SectionHeader>Technical Details</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {initialProductData.techstack?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {initialProductData.techstack.map((item, i) => <Pill key={i}>{item}</Pill>)}
                  </div>
                </div>
              )}
              {initialProductData.compatibility?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Compatibility</p>
                  <div className="flex flex-wrap gap-1.5">
                    {initialProductData.compatibility.map((item, i) => <Pill key={i}>{item}</Pill>)}
                  </div>
                </div>
              )}
              {initialProductData.requirement?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Requirements</p>
                  <div className="flex flex-wrap gap-1.5">
                    {initialProductData.requirement.map((item, i) => <Pill key={i}>{item}</Pill>)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Links & file */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#13112a]/50 p-6">
            <SectionHeader>Links & Resources</SectionHeader>
            <div className="divide-y divide-white/[0.05]">
              <InfoRow label="Preview">
                {initialProductData.previewUrl ? (
                  <a href={initialProductData.previewUrl} target="_blank"
                    className="text-violet-400 hover:text-violet-300 hover:underline transition-colors">
                    {initialProductData.previewUrl}
                  </a>
                ) : (
                  <span className="text-white/25">No preview available</span>
                )}
              </InfoRow>
              <InfoRow label="API Docs">
                {initialProductData.apiDocUrl ? (
                  <a href={initialProductData.apiDocUrl} target="_blank"
                    className="text-violet-400 hover:text-violet-300 hover:underline transition-colors">
                    {initialProductData.apiDocUrl}
                  </a>
                ) : (
                  <span className="text-white/25">No API docs available</span>
                )}
              </InfoRow>
              <InfoRow label="File">
                {initialProductData.uploadedFilePath ? (
                  <a href={initialProductData.uploadedFilePath} download
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20 transition-colors text-xs font-medium">
                    ↓ Download File
                  </a>
                ) : (
                  <span className="text-white/25">No file uploaded</span>
                )}
              </InfoRow>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}