import { ProductGrid } from "@/components/home/ProductGrid";
import {
  getProductsByTag,
  getProductsByCategory,
  getAllProductsAction,
} from "@/lib/actions/product.actions";
import { Footer } from "@/components/layout/Footer";

type ProductsPageProps = {
  searchParams: Promise<{
    tag?: string;
    category?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const tag = params?.tag;
  const category = params?.category;

  console.log("Fetching products for:", { tag, category });

  let products;
  let title = "สินค้าทั้งหมด";

  // Category name mapping for display
  const categoryNameMap: Record<string, string> = {
    "ui-kit": "UI Kit",
    "frontend-template": "Frontend Template",
    "backend-template": "Backend Template",
  };

  if (tag) {
    products = await getProductsByTag(tag);
    title = (
      <>
        Tag: <span className="text-purple-400">{tag}</span>
      </>
    ) as any;
  } else if (category) {
    products = await getProductsByCategory(category);
    const displayName = categoryNameMap[category] || category;
    title = (
      <>
        Category: <span className="text-purple-400">{displayName}</span>
      </>
    ) as any;
  } else {
    products = await getAllProductsAction();
  }

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-white mb-6">{title}</h1>

        <ProductGrid products={products} showHeader={false} />
      </div>
      <Footer />
    </>
  );
}
