import { notFound } from 'next/navigation';
import { Product } from '@/lib/types/product';
import EditButton from './EditButton';
import BackButton from './BackButton';
import ProductImages from './ProductImages';

async function getProductData(productId: string): Promise<Product | null> {
    const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

    const res = await fetch(`${API_URL}/products/${productId}`, {
        // 'no-store' เหมาะสำหรับข้อมูลที่ไม่ควร Cache (เช่น ข้อมูลที่กำลังจะแก้ไข)
        cache: 'no-store'
    });


    if (!res.ok) {
        notFound();
    }

    return res.json();
}

export default async function ProductStoreDetailPage(
    { params }: { params: { productId: string } }
) {
    const productId = (await params).productId;

    const initialProductData = await getProductData(productId);

    if (!initialProductData) {
        notFound();
    }

    // Ensure we pass a string (or undefined) to the <img src> prop.
    // If hero_image_url is already a string use it, otherwise try common fields on an object.
    const heroSrc: string | undefined =
        typeof initialProductData.hero_image_url === 'string'
            ? initialProductData.hero_image_url
            : (initialProductData.hero_image_url as any)?.url ?? (initialProductData.hero_image_url as any)?.src ?? undefined;

    return (
        <div className="min-h-screen bg-linne-purple text-white p-6">
            {/* Buttons */}
            <div className="flex gap-4 mb-6">
                <BackButton className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow" />
                <EditButton
                    productId={productId}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Product Info */}
                <div className="md:col-span-2 space-y-4 bg-linne-purple-hover p-6 rounded shadow">
                    <h1 className="text-3xl font-bold text-primary mb-4">Product Information</h1>
                    <h2 className="text-2xl font-semibold">{initialProductData.name}</h2>
                    <p className="text-gray-200">{initialProductData.description}</p>
                    <p className="font-semibold">Price: <span className="text-primary">{initialProductData.price}</span></p>
                    <p>Blurb: {initialProductData.blurb}</p>
                    <p>Installation Guide: {initialProductData.installation_guide}</p>

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

                    <p>Category: <span className="text-primary">{initialProductData.category.name}</span></p>
                    <p>Preview URL: <a href={initialProductData.preview_url} className="text-primary hover:underline">{initialProductData.preview_url}</a></p>

                    {/* Uploaded file */}
                    <div className="mt-4">
                        <h3 className="font-semibold text-lg">Uploaded File</h3>
                        {initialProductData.uploaded_file_path ? (
                            <a
                                href={initialProductData.uploaded_file_path}
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
                <ProductImages heroSrc={heroSrc} detailImages={initialProductData.detail_images} />
            </div>
        </div>


    );
}