import { ProductGrid } from "@/components/home/ProductGrid";
import { getProductsBySearchQuery } from "@/lib/actions/product.actions";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params?.q || "";

  const results = await getProductsBySearchQuery(q);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-white mb-6">
        ผลการค้นหา: <span className="text-purple-400">"{q}"</span>
      </h1>
      <ProductGrid products={results} showHeader={false} />
    </div>
  );
}
