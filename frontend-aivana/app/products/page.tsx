import { ProductGrid } from "@/components/home/ProductGrid";
import {
  getProductsByTag,
  getAllProductsAction,
} from "@/lib/actions/product.actions";

type ProductsPageProps = {
  searchParams: Promise<{
    tag?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const tag = params?.tag || "all";

  console.log("Fetching products for tag:", tag);

  const products =
    tag === "all" ? await getAllProductsAction() : await getProductsByTag(tag);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-white mb-6">
        {tag === "all" ? (
          "สินค้าทั้งหมด"
        ) : (
          <>
            Tag: <span className="text-purple-400">{tag}</span>
          </>
        )}
      </h1>

      <ProductGrid products={products} showHeader={false} />
    </div>
  );
}
