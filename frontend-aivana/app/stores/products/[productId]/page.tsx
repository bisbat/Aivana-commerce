import { notFound } from "next/navigation";
import { Product } from "@/lib/types/product/product";
import EditButton from "./EditButton";
import BackButton from "./BackButton";
import ProductImages from "./ProductImages";
import DeleteButton from "./DeleteButton";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import { getProductByIdAction } from "@/lib/actions/product.actions";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";

async function getProductData(productId: string): Promise<Product | null> {
  const productData = await getProductByIdAction(productId);
  return productData || null;
}

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductStoreDetailPage({ params }: PageProps) {
  const productId = (await params).productId;

  const initialProductData = await getProductData(productId);

  if (!initialProductData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linne-purple text-white p-6">
      {/* Buttons */}
      <div className="flex gap-4 mb-6 space-x-4 justify-between">
        <BackButton />
        <div className="flex gap-4">
          <DeleteButton
            productId={productId}
            productName={initialProductData.name}
          />
          <EditButton productId={productId} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Product Info */}
        <div className="md:col-span-2 space-y-4 bg-linne-purple-hover p-6 rounded shadow">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Product Information
          </h1>
          <h2 className="text-2xl font-semibold">{initialProductData.name}</h2>
          <p className="text-gray-200">{initialProductData.description}</p>
          <p className="font-semibold">
            Price:{" "}
            <span className="text-primary">
              {formatPriceWithCurrency(initialProductData.price)}
            </span>
          </p>
          <p>Blurb: {initialProductData.blurb}</p>
          {initialProductData.installationGuide && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Installation Guide</h3>
              <MarkdownRenderer
                content={initialProductData.installationGuide}
              />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg">Features</h3>
            <ul className="list-disc list-inside text-gray-200">
              {initialProductData.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Compatibility</h3>
            <ul className="list-disc list-inside text-gray-200">
              {initialProductData.compatibility.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <p>
            Category:{" "}
            <span className="text-primary">
              {initialProductData.category.name}
            </span>
          </p>
          <p>
            Tags: {initialProductData.tags.map((tag) => tag.name).join(", ")}
          </p>
          <p>
            Preview URL:{" "}
            {initialProductData.previewUrl ? (
              <a
                href={initialProductData.previewUrl}
                className="text-primary hover:underline"
                target="_blank"
              >
                {initialProductData.previewUrl}
              </a>
            ) : (
              <span className="text-gray-400">No preview available</span>
            )}
          </p>

          {/* Uploaded file */}
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Uploaded File</h3>
            {initialProductData.uploadedFilePath ? (
              <a
                href={initialProductData.uploadedFilePath}
                download
                className="text-primary hover:underline"
              >
                Download File
              </a>
            ) : (
              <p>No uploaded file available.</p>
            )}
          </div>
        </div>

        {/* Images */}
        <ProductImages
          heroSrc={initialProductData.heroImageUrl}
          detailImages={initialProductData.detailImages}
        />
      </div>
    </div>
  );
}
