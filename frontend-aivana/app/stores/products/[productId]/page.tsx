import { notFound } from 'next/navigation';
import { Product } from '@/lib/types/product';
import ProductDetailContainer from './ProductDetailContainer'; // ยังไม่ได้สร้าง เลยคอมเมนต์ไว้ก่อน

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

    return (
        <div>
            <ProductDetailContainer initialData={initialProductData} />
        </div>
    );
}