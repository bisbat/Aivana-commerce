// app/stores/products/[productId]/ProductDetailContainer.tsx
"use client";
import { useState } from 'react';
import { Product } from '@/lib/types/product';
import ProductViewForm from './ProductViewForm';
import ProductEditForm from './ProductEditForm';

export default function ProductDetailContainer({ initialData }: { initialData: Product }) {
    const [isEditing, setIsEditing] = useState(false);
    const handleToggleEdit = () => { setIsEditing(!isEditing); };

    return (
        <div className="p-6 rounded-lg shadow-md">
            {/* Header และปุ่ม Edit */}
            <div className="flex justify-between items-center mb-6">
                <button className="flex items-center text-purple-600 hover:text-purple-800">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Back
                </button>
                <div className='space-x-3'>
                    <button
                        className="bg-red-600 text-sm px-4 py-2 rounded shadow-sm text-white hover:bg-red-700 hover:shadow-md"
                    >
                        Delete
                    </button>
                    <button
                        onClick={handleToggleEdit} // 💡 ปุ่ม Edit ยังคงอยู่ที่นี่เพื่อเปลี่ยน State isEditing
                        className="bg-[var(--primary)] text-sm px-4 py-2 rounded shadow-sm text-white hover:bg-[var(--primary-hover)] hover:shadow-md"
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>

            </div>

            <h2 className="text-2xl font-bold mb-4">{initialData.name}</h2>

            {isEditing ? (
                // 🛑 โหมดแก้ไข
                <ProductEditForm product={initialData} setIsEditing={setIsEditing} />
            ) : (
                // 🚀 โหมดดู: แสดง ProductView
                <ProductViewForm product={initialData} onClose={handleToggleEdit} />
            )}
        </div>
    );
}