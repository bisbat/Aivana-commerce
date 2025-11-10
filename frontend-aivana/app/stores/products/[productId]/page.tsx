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
        // <div>
        //     {/* header */}
        //     <div className="flex justify-between items-center mb-6">
        //         <button className="flex items-center text-purple-600 hover:text-purple-800">
        //             <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        //             Back
        //         </button>
        //         <button className="bg-[var(--primary)] text-sm px-4 py-2 rounded shadow-sm text-white hover:bg-[var(--primary-hover)] hover:shadow-md">
        //             Edit
        //         </button>
        //     </div>
        //     {/* container for product details */}
        //     <div className="p-6 rounded-lg shadow-md">
        //         <h2 className="text-2xl font-bold mb-4">
        //             {initialProductData.name}
        //         </h2>
        //         <div className="flex space-x-2 border-b mb-6">
        //             <span className="px-4 py-2 border-b-2 border-purple-600 font-semibold text-purple-600 cursor-pointer">
        //                 Product Information
        //             </span>
        //             <span className="px-4 py-2 text-gray-500 cursor-pointer hover:text-gray-700">
        //                 Product Images
        //             </span>
        //             <span className="px-4 py-2 text-gray-500 cursor-pointer hover:text-gray-700">
        //                 Product File
        //             </span>
        //         </div>
        //         {/* product information */}
        //         <div className="text-sm space-y-4">
        //             <p><strong>Blurb:</strong> {initialProductData.blurb}</p>
        //             <p><strong>Category:</strong> {initialProductData.category.name}</p>
        //             <p>
        //                 <strong>Product Description:</strong>
        //                 <div className="whitespace-pre-wrap mt-1 text-gray-700">{initialProductData.description}</div>
        //             </p>
        //             <p><strong>Price:</strong> {parseFloat(initialProductData.price).toFixed(2)} {initialProductData.category.name.includes("UI kit") ? 'Baht' : 'USD'}</p>
        //             <p>
        //                 <strong>Features:</strong>
        //                 <ul className="list-disc list-inside ml-4 mt-1 text-gray-700">
        //                     {initialProductData.features.map((f, index) => (
        //                         <li key={index}>{f}</li>
        //                     ))}
        //                 </ul>
        //             </p>
        //         </div>
        //         <div>
        //             {/* product images */}
        //         </div>
        //         <div>
        //             {/* product file */}
        //         </div>
        //     </div>
        // </div>

    );
}